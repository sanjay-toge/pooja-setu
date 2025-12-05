export const dummy = {
  "cities": [
    "Pune",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Delhi"
  ],
  "deities": [
    "Ganesha",
    "Shiva",
    "Vishnu",
    "Durga",
    "Hanuman",
    "Lakshmi"
  ],
  "languages": [
    "hi",
    "en",
    "mr",
    "ta",
    "te",
    "kn"
  ],
  "temples": [
    {
      "id": "t1",
      "name": "Shree Siddhivinayak Temple",
      "city": "Mumbai",
      "deities": [
        "Ganesha"
      ],
      "rating": 4.8,
      "heroImageUrl": "https://picsum.photos/seed/siddhi/800/400",
      "description": "A revered temple dedicated to Lord Ganesha, known for blessings and prosperity."
    },
    {
      "id": "t2",
      "name": "ISKCON Pune",
      "city": "Pune",
      "deities": [
        "Vishnu"
      ],
      "rating": 4.7,
      "heroImageUrl": "https://picsum.photos/seed/iskcon/800/400",
      "description": "Hare Krishna temple offering spiritual programs and prasadam."
    }
  ],
  "poojas": [
    {
      "id": "p1",
      "templeId": "t1",
      "title": "Ganesh Abhishek",
      "type": "Abhishek",
      "basePriceINR": 801,
      "durationMinutes": 30,
      "metadata": {
        "deity": "Ganesha",
        "language": "hi"
      },
      "addOns": [
        {
          "id": "prasad",
          "name": "Prasad Courier",
          "priceINR": 151
        },
        {
          "id": "archana",
          "name": "Archana Name Sankalp",
          "priceINR": 101
        }
      ]
    },
    {
      "id": "p2",
      "templeId": "t2",
      "title": "Lakshmi Narayan Pooja",
      "type": "Pooja",
      "basePriceINR": 1101,
      "durationMinutes": 45,
      "metadata": {
        "deity": "Vishnu",
        "language": "en"
      },
      "addOns": [
        {
          "id": "tilak",
          "name": "Tilak & Prasad",
          "priceINR": 201
        }
      ]
    }
  ],
  "schedules": {
    "p1": [
      {
        "id": "08:00",
        "start": "08:00",
        "end": "08:30",
        "remaining": 2
      },
      {
        "id": "08:30",
        "start": "08:30",
        "end": "09:00",
        "remaining": 3
      }
    ],
    "p2": [
      {
        "id": "10:00",
        "start": "10:00",
        "end": "10:45",
        "remaining": 1
      },
      {
        "id": "11:00",
        "start": "11:00",
        "end": "11:45",
        "remaining": 2
      }
    ]
  }
}