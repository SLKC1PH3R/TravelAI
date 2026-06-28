/**
 * SpinnerRotation.ts — rotation continue du loader.
 * Attache ce script directement sur l'objet `Spinner` (voir lens-setup.md).
 */

@component
export class SpinnerRotation extends BaseScriptComponent {
  onAwake() {
    this.createEvent("UpdateEvent").bind(() => {
      const t = this.getSceneObject().getTransform();
      t.setLocalRotation(quat.fromEulerAngles(0, 0, getTime() * -2));
    });
  }
}
