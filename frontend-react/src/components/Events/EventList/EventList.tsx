import EventItem from './EventItem/EventItem'
import './EventList.css'
const eventList = (props: any) => {
  const events = props.events.map(
    (event: { _id: any; title: any; price: any; creator: any }) => {
      return (
        <EventItem
          key={event._id}
          eventId={event._id}
          title={event.title}
          price={event.price}
          creatorId={event.creator._id}
          userId={props.authUserId}
        />
      )
    }
  )
  return <ul className="event__list">{events}</ul>
}

export default eventList
