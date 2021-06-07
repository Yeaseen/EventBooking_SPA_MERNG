import './BookingList.css'

const bookingList = (props: any) => {
  const bookings = props.bookings.map(
    (booking: { _id: any; event: any; createdAt: any }) => {
      return (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            {booking.event.title} -{' '}
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div className="bookings__item-actions">
            <button onClick={props.onDelete.bind(this, booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      )
    }
  )
  return (
    <div className="bookings__list">
      <h2>Booked Events!</h2>
      <ul>{bookings}</ul>
    </div>
  )
}

export default bookingList
