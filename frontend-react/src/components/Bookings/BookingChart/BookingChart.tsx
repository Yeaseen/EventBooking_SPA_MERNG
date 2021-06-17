import React from 'react'
import { Bar as BarChart } from 'react-chartjs-2'

const bookingsChart = (props: any) => {
  const output: any = {}
  output['Cheap'] = 0
  output['Normal'] = 0
  output['Expensive'] = 0

  //console.log(output)
  props.bookings.forEach((booking: { event: { price: number } }) => {
    if (booking.event.price <= 100) {
      output['Cheap'] = output['Cheap'] + 1
    } else if (booking.event.price > 100 && booking.event.price <= 200) {
      output['Normal'] = output['Normal'] + 1
    } else {
      output['Expensive'] = output['Expensive'] + 1
    }
  })
  //console.log(output['Cheap'])
  const chartData: any = { labels: [], datasets: [] }

  chartData.labels.push('Cheap', 'Normal', 'Expensive')

  chartData.datasets.push({
    label: 'Events',
    fillColor: 'rgba(220,220,220,0.5)',
    strokeColor: 'rgba(220,220,220,0.8)',
    highlightFill: 'rgba(220,220,220,0.75)',
    highlightStroke: 'rgba(220,220,220,1)',

    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)'
    ],
    borderWidth: 2,
    data: [output['Cheap'], output['Normal'], output['Expensive']]
  })

  const options = {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Frequencies of Different Bookings based on Price',
      fontSize: 25
    },
    layout: {
      padding: {
        left: 175,
        right: 175,
        bottom: 100,
        top: 0
      }
    },
    legend: {
      display: true,
      position: 'right',
      label: {
        fontColor: '#000'
      }
    }
  }

  return (
    <div className="chart">
      <BarChart
        type="bar"
        data={chartData}
        width={100}
        height={500}
        options={options}
      />
    </div>
  )
}

export default bookingsChart
