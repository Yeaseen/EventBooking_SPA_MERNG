import './EventItem.css'
const eventItem = (props: any) => (
  <li key={props.eventId} className="events__list-items">
    <div>
      <h1>{props.title}</h1>
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>You are the owner of this event</p>
      ) : (
        <button onClick={props.onDetail.bind(this, props.eventId)}>
          View Details
        </button>
      )}
    </div>
  </li>
)

export default eventItem
