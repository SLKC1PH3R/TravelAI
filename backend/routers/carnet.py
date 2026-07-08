import io
import os
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image as PdfImage,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from sqlalchemy.orm import Session, joinedload

import models
import storage
from database import get_db

router = APIRouter(prefix="/carnet", tags=["carnet"])


@router.post("/{trip_id}")
def generate_carnet(trip_id: uuid.UUID, db: Session = Depends(get_db)):
    trip = (
        db.query(models.Trip)
        .options(joinedload(models.Trip.monuments).joinedload(models.Monument.photos))
        .options(joinedload(models.Trip.monuments).joinedload(models.Monument.conversations))
        .filter(models.Trip.id == trip_id)
        .first()
    )
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    user = db.query(models.User).filter(models.User.id == trip.user_id).first()
    if user is not None and user.first_carnet_export_at is None:
        user.first_carnet_export_at = datetime.utcnow()
        db.commit()

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2 * cm, bottomMargin=2 * cm)
    styles = getSampleStyleSheet()
    story = []

    trip_label = trip.title or ", ".join(filter(None, [trip.city, trip.country])) or "Voyage"
    story.append(Paragraph(f"Carnet de voyage - {trip_label}", styles["Title"]))
    dates = trip.started_at.strftime("%d/%m/%Y")
    if trip.ended_at:
        dates += f" - {trip.ended_at.strftime('%d/%m/%Y')}"
    story.append(Paragraph(dates, styles["Normal"]))
    story.append(Spacer(1, 0.5 * cm))

    total_photos = sum(len(m.photos) for m in trip.monuments)
    total_conversations = sum(len(m.conversations) for m in trip.monuments)
    stats_table = Table(
        [
            ["Monuments visites", "Photos", "Conversations"],
            [str(len(trip.monuments)), str(total_photos), str(total_conversations)],
        ]
    )
    stats_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), "#dddddd"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("GRID", (0, 0), (-1, -1), 0.5, "#999999"),
            ]
        )
    )
    story.append(stats_table)
    story.append(Spacer(1, 1 * cm))

    for monument in trip.monuments:
        story.append(Paragraph(monument.name, styles["Heading2"]))
        story.append(Paragraph(f"Visite le {monument.visited_at.strftime('%d/%m/%Y')}", styles["Italic"]))
        if monument.description:
            story.append(Paragraph(monument.description.replace("\n", "<br/>"), styles["Normal"]))
        story.append(Spacer(1, 0.3 * cm))

        for photo in monument.photos:
            if not photo.stored:
                continue
            path = storage.photo_path(user.anonymous_uuid, photo.filename)
            if os.path.exists(path):
                try:
                    story.append(PdfImage(path, width=10 * cm, height=7.5 * cm))
                    story.append(Spacer(1, 0.3 * cm))
                except Exception:
                    pass

        if monument.conversations:
            story.append(Paragraph("Conversations", styles["Heading3"]))
            for conv in monument.conversations:
                story.append(Paragraph(f"<b>Q :</b> {conv.question}", styles["Normal"]))
                story.append(Paragraph(f"<b>R :</b> {conv.answer}", styles["Normal"]))
                story.append(Spacer(1, 0.2 * cm))

        story.append(PageBreak())

    doc.build(story)
    buffer.seek(0)

    filename = f"carnet-{trip.city or trip.title or trip.id}-{trip.id}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
