/**
 * AnalyzeController.ts — TravelAI Lens (Lens Studio 5.22, TypeScript)
 *
 * Attache ce script au Canvas (ou a un SceneObject racine de l'UI) et
 * assigne chaque @input dans l'Inspector. Voir lens-setup.md pour la
 * hierarchie complete de la scene et assets-required.md pour les images.
 *
 * Corrections apportees par rapport au brouillon initial (voir le recap
 * en fin de reponse pour le detail) :
 *   1. image_base64 etait envoye vide ("") -> le backend ne pouvait jamais
 *      identifier de monument. On capture maintenant la texture camera et
 *      on l'encode en base64 via Base64.encodeTextureAsync avant l'appel.
 *   2. L'URL d'API pointait vers le domaine du FRONTEND
 *      (travelai.digitalstack.cloud) au lieu du domaine de l'API
 *      (travelai-api.digitalstack.cloud) -> tous les appels /analyze
 *      auraient echoue. Separe en API_BASE (backend) et WEB_BASE (site,
 *      utilise uniquement pour ouvrir le dashboard dans le navigateur).
 *   3. Le suivi de conversation (followUp) repostait sur /analyze avec un
 *      champ "monument_id" que ce endpoint n'accepte pas. Il appelle
 *      maintenant le vrai endpoint POST /conversations/monument/{id}.
 */

@component
export class AnalyzeController extends BaseScriptComponent {

  // Texture camera (Device Camera Texture) utilisee pour capturer l'image
  // a analyser. Voir lens-setup.md, section "Texture camera".
  @input cameraTexture: Texture;

  @input textMonumentName: Text;
  @input textResult: Text;
  @input textQuestion: Text;
  @input btnCapture: Image;
  @input btnSend: Image;
  @input btnDashboard: Image;
  @input spinner: Image;
  @input panelResult: SceneObject;

  private uuid: string = "";
  private monumentId: string = "";

  // Domaine de l'API backend FastAPI (utilise pour /analyze, /conversations).
  private readonly API_BASE = "https://travelai-api.digitalstack.cloud";
  // Domaine du site web (utilise uniquement pour ouvrir le dashboard).
  private readonly WEB_BASE = "https://travelai.digitalstack.cloud";

  onAwake() {
    this.uuid = this.initUUID();
    this.resetUI();
    this.bindButtons();
  }

  private initUUID(): string {
    const k = "travelai_uuid";
    const v = global.persistentStorageSystem.getString(k);
    if (v && v.length > 0) return v;
    const id = "ls" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    global.persistentStorageSystem.putString(k, id);
    return id;
  }

  private resetUI() {
    this.panelResult.enabled = false;
    this.spinner.enabled = false;
    this.btnSend.enabled = false;
    this.btnDashboard.enabled = false;
    this.btnCapture.enabled = true;
    this.textResult.text = "";
    this.textMonumentName.text = "";
  }

  private bindButtons() {
    this.addTouch(this.btnCapture.sceneObject, () => this.analyze());
    this.addTouch(this.btnSend.sceneObject, () => {
      const q = this.textQuestion.text.trim();
      if (q) this.followUp(q);
    });
    this.addTouch(this.btnDashboard.sceneObject, () => {
      global.openUrl(this.WEB_BASE + "/dashboard?uuid=" + this.uuid);
    });
  }

  private addTouch(obj: SceneObject, cb: () => void) {
    const t = obj.getComponent("Component.TouchComponent") as TouchComponent;
    if (t) t.addTouchStartEvent(cb);
  }

  /** Lance la capture de la texture camera, puis l'analyse une fois encodee. */
  private analyze() {
    this.spinner.enabled = true;
    this.btnCapture.enabled = false;
    this.panelResult.enabled = false;

    if (!this.cameraTexture) {
      this.showError("Texture camera non assignee.");
      return;
    }

    Base64.encodeTextureAsync(
      this.cameraTexture,
      (base64: string) => this.sendAnalyze(base64),
      () => this.showError("Erreur de capture camera."),
      CompressionQuality.LowQuality,
      EncodingType.Jpg
    );
  }

  private async sendAnalyze(base64: string) {
    try {
      const net = InternetModule as any;
      const res = await net.fetch(new Request(this.API_BASE + "/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_base64: "data:image/jpeg;base64," + base64,
          question: "Identifie ce monument. Donne son nom et une description de 2 phrases.",
          uuid: this.uuid
        })
      }));
      const data = await res.json();
      this.monumentId = data.monument_id ?? "";
      this.textMonumentName.text = data.monument_name ?? "Monument";
      this.textResult.text = data.answer ?? "";
      this.spinner.enabled = false;
      this.btnCapture.enabled = true;
      this.panelResult.enabled = true;
      this.btnSend.enabled = true;
      this.btnDashboard.enabled = true;
    } catch (e) {
      this.showError("Erreur de connexion.");
    }
  }

  private async followUp(question: string) {
    if (!this.monumentId) {
      this.textResult.text = "Identifie d'abord un monument avec le bouton Analyser.";
      return;
    }
    const prev = this.textResult.text;
    this.textResult.text = "...";
    this.btnSend.enabled = false;
    try {
      const net = InternetModule as any;
      const url = this.API_BASE + "/conversations/monument/" + this.monumentId
        + "?question=" + encodeURIComponent(question);
      const res = await net.fetch(new Request(url, { method: "POST" }));
      const data = await res.json();
      this.textResult.text = data.answer ?? prev;
    } catch (e) {
      this.textResult.text = prev;
    } finally {
      this.btnSend.enabled = true;
      this.textQuestion.text = "";
    }
  }

  private showError(message: string) {
    this.spinner.enabled = false;
    this.btnCapture.enabled = true;
    this.textResult.text = message;
    this.panelResult.enabled = true;
  }
}
