import './Modal.css'

interface customProps {
  title: string
  children: any
  canCancel: boolean
  canConfirm: boolean
}

const modal = (props: customProps) => (
  <div className="modal">
    <header className="modal__header">
      <h1>{props.title}</h1>
    </header>
    <section className="modal__content">{props.children}</section>
    <section className="modal__actions">
      {props.canCancel && <button className="btn">Cancel</button>}
      {props.canConfirm && <button className="btn">Confirm</button>}
    </section>
  </div>
)

export default modal
