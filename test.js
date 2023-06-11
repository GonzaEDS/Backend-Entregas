import products from './src/dao/product.manager.js'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000/'
import Logger from './src/logger/winston-logger.js'

const oldProducts = `[
  {
    "title": "Apple MacBook Air",
    "description": "The MacBook Air is designed to be more portable and powerful than ever, with a sleek new design and the power of the M1 chip.",
    "price": 999.99,
    "stock": 10,
    "thumbnail": "https://http2.mlstatic.com/D_NQ_NP_2X_842067-MLA51077081477_082022-F.webp",
    "category": "Computers"
    },
    {
    "title": "Sony WH-1000XM4",
    "description": "Experience the next level of silence with these headphones featuring an improved design for better noise-cancellation.",
    "price": 350.5,
    "thumbnail": "https://http2.mlstatic.com/D_NQ_NP_2X_942427-MLA50436038781_062022-F.webp",
    "stock": 100,
    "category": "Headphones"
    },
    {
    "title": "Apple AirPods Pro",
    "description": "The Apple AirPods Pro Wireless Earbuds feature active noise cancelling and transparency mode, so you can focus on your music or your surroundings as you prefer. They also have spatial audio technology for an immersive listening experience, customizable fit to ensure a snug and comfortable fit, and are sweat and water resistant for active lifestyles. Bluetooth connectivity makes them easy to use with your iPhone or other compatible devices.",
    "price": 249,
    "thumbnail": "https://m.media-amazon.com/images/I/71bhWgQK-cL._AC_UL320_.jpg",
    "stock": 49,
    "category": "Earbuds"
    },
    {
    "title": "Apple Watch Series 7",
    "description": "The Apple Watch Series 7 is a powerful and versatile smartwatch that features a range of fitness tracking and health monitoring features, including blood oxygen and ECG apps. It also has an always-on retina display for easy access to information, and is water resistant for swimming and other water-based activities. The watch comes with a midnight aluminum case and midnight sport band, and is compatible with the Apple Fitness+ service.",
    "price": 399,
    "thumbnail": "https://m.media-amazon.com/images/I/71fxj9HPLPL._AC_UL320_.jpg",
    "stock": 15,
    "category": "Watches"
    },
    {
    "title": "Fire TV Stick with Alexa Voice Remote",
    "description": "The Fire TV Stick with Alexa Voice Remote is an HD streaming device that provides access to thousands of channels, apps, and Alexa skills. You can use the Alexa Voice Remote to control your TV and other compatible smart devices, or simply ask Alexa to find what you want to watch. The device is easy to set up and use, and comes with all the cables and accessories you need.",
    "price": 39.99,
    "thumbnail": "https://m.media-amazon.com/images/I/51KKR5uGn6L._AC_UL320_.jpg",
    "stock": 28,
    "category": "Streaming Devices"
    },
    {
      "title": "Fire TV Stick 4K",
      "description": "The Fire TV Stick 4K streaming device provides access to 4K Ultra HD, Dolby Vision, HDR, and HDR10+ content from popular streaming services like Netflix, Hulu, and Amazon Prime Video. It comes with the latest Alexa Voice Remote, which includes TV controls and allows you to use voice commands to control your TV and other compatible devices. The device is easy to set up and use, and includes all the necessary cables and accessories.",
      "price": 49.99,
      "thumbnail": "https://m.media-amazon.com/images/I/411y5UdVmvL._AC_UL320_.jpg",
      "stock": 48,
      "category": "Electronics"
    },
    {
      "title": "Fire HD 10 tablet",
      "description": "10.1” 1080p full HD display, 32 or 64 GB of internal storage (add up to 1 TB with microSD), 2.0 GHz quad-core processor, 3 GB RAM, and up to 12 hours of battery life.",
      "price": 149.99,
      "thumbnail": "https://m.media-amazon.com/images/I/61uE03cRsyS._AC_UL320_.jpg",
      "stock": 6,
      "category": "Electronics"
    },
    {
      "title": "Amazon Basics AAA Batteries (36-Pack)",
      "description": "Pack of 36 AAA high-performance alkaline batteries ideal for a variety of devices, including game controllers, toys, flashlights, digital cameras, and clocks.",
      "price": 11.99,
      "thumbnail": "https://m.media-amazon.com/images/I/71nDX36Y9UL._AC_UL320_.jpg",
      "stock": 14,
      "category": "Electronics"
    },
    {
      "title": "Echo Dot (3rd Gen)",
      "description": "Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small spaces.",
      "price": 49.99,
      "thumbnail": "https://m.media-amazon.com/images/I/6182S7MYC2L._AC_UL320_.jpg",
      "stock": 36,
      "category": "Electronics"
    },
    {
      "title": "Titan Audio Helios Mains Block",
      "description": "6-way mains block with surge protection, ideal for home theater systems and high-end audio equipment.",
      "price": 139.99,
      "thumbnail": "https://m.media-amazon.com/images/I/61gLkyHIrvS._AC_UL320_.jpg",
      "stock": 16,
      "category": "Electronics"
    },
    {
      "title": "Acer Keyboard (US/International) USB Black",
      "description": "Full-size USB keyboard with US/international layout, perfect for home or office use.",
      "price": 29.99,
      "thumbnail": "https://m.media-amazon.com/images/I/61buVHUfooL._AC_UL320_.jpg",
      "stock": 33,
      "category": "Electronics"
    },
    {
    "title": "Ubiquiti UISP Cable Pro",
    "description": "1000-ft box of industrial-grade weatherproof Category 5e ethernet cable, ideal for outdoor installations.",
    "price": 199.99,
    "thumbnail": "https://m.media-amazon.com/images/I/41POSttPvNL._AC_UL320_.jpg",
    "stock": 5,
    "category": "Ethernet Cable"
  },
  {
    "title": "Meta Quest 2 — Advanced Virtual Reality Headset — 128 GB",
    "description": "Experience immersive gaming and entertainment with the Meta Quest 2 VR headset",
    "price": 449.99,
    "thumbnail": "https://m.media-amazon.com/images/I/61tE7IcuLmL._AC_UY218_.jpg",
    "stock": 26,
    "category": "Virtual Reality Headset"
  },
  {
    "title": "$10 -PlayStation Store Gift Card [Digital Code]",
    "description": "Get access to the latest games, add-ons, and more on the PlayStation Store with this $10 gift card",
    "price": 10,
    "thumbnail": "https://m.media-amazon.com/images/I/51NJ1p45r5L._AC_UY218_.jpg",
    "stock": 40,
    "category": "Gift Card"
  },
  {
    "title": "PS5 Console- Horizon Forbidden West Bundle",
    "description": "Experience the new generation of play with the PS5 console",
    "price": 669.99,
    "thumbnail": "https://m.media-amazon.com/images/I/71fa5+U25cL._AC_UY218_.jpg",
    "stock": 25,
    "category": "Gaming Console"
  },
  {
    "title": "$25 PlayStation Store Gift Card [Digital Code]",
    "description": "Get access to the latest games, add-ons, and more on the PlayStation Store with this $25 gift card",
    "price": 25,
    "thumbnail": "https://m.media-amazon.com/images/I/51hUzkHpoEL._AC_UY218_.jpg",
    "stock": 42,
    "category": "Gift Card"
  },
  {
    "title": "Roblox Digital Gift Card - 800 Robux [Includes Exclusive Virtual Item]",
    "description": "Get 800 Robux and an exclusive virtual item in Roblox with this digital gift card",
    "price": 9.99,
    "thumbnail": "https://m.media-amazon.com/images/I/71SfFWK2AUL._AC_UY218_.jpg",
    "stock": 24,
    "category": "Gift Card"
  },
  {
    "title": "$100 PlayStation Store Gift Card [Digital Code]",
    "description": "Get access to the latest games, add-ons, and more on the PlayStation Store with this $100 gift card",
    "price": 100,
    "thumbnail": "https://m.media-amazon.com/images/I/51JLY4kBluL._AC_UY218_.jpg",
    "stock": 14,
    "category": "Gift Card"
  }
]`

const computers = `[
    {
        "title": "Apple 2021 10.2-inch iPad",
        "thumbnail": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/61PnHlc0HCL._AC_UL320_.jpg",
        "category": "Computers",
        "description": "Apple 2021 10.2-inch iPad (Wi-Fi, 64GB) - Silver (9th Generation)",
        "price": 499.00
    },
    {
        "title": "Apple 2020 MacBook Air Laptop",
        "thumbnail": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/71jG+e7roXL._AC_UL320_.jpg",
        "category": "Computers",
        "description": "Apple 2020 MacBook Air Laptop M1 Chip, Retina Display, 8GB RAM, 256GB SSD Storage, Backlit Keyboard, FaceTime HD Camera, Touch ID. Works with iPhone/iPad; Space Gray",
        "price": 999.00
    },
    {
        "title": "Apple 2022 10.9-inch iPad",
        "thumbnail": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/61goypdjAYL._AC_UL320_.jpg",
        "category": "Computers",
        "description": "Apple 2022 10.9-inch iPad (Wi-Fi, 64GB) - Silver (10th Generation)",
        "price": 649.00
    },
    {
        "title": "Apple 2021 10.2-inch iPad",
        "thumbnail": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/61NGnpjoRDL._AC_UL320_.jpg",
        "category": "Computers",
        "description": "Apple 2021 10.2-inch iPad (Wi-Fi, 64GB) - Space Gray (9th Generation)",
        "price": 499.00
    },
    {
        "title": "Fire HD 8 Plus tablet",
        "thumbnail": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/716EfjwGTGL._AC_UL320_.jpg",
        "category": "Computers",
        "description": "Fire HD 8 Plus tablet, HD display, 64 GB, (2020 release), our best tablet for portable entertainment, Slate",
        "price": 119.99
    },
    {
        "title": "Amazon Fire 7 Kids tablet",
        "thumbnail": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/71JpNSKMRJL._AC_UL320_.jpg",
        "category": "Computers",
        "description": "Amazon Fire 7 Kids tablet, ages 3-7. Top-selling kids tablet on Amazon - 2022. Set time limits, age filters, educational goals, and more with parental controls, 16 GB, Blue",
        "price": 99.99
    }]`

const newProducts = `[
  {
    "title": "FIFINE Studio Monitor Headphones",
    "thumbnail": "https://m.media-amazon.com/images/I/81RJD-YQOyL._AC_UL400_.jpg",
    "category": "Headphones",
    "description": "FIFINE Studio Monitor Headphones for Recording-Over Ear Wired Headphones for Podcast Monitoring, Streaming Comfortable Equipment with Detachable Cables 3.5mm or 6.35mm Jack, Black, on PC/Mixer-H8",
    "price": 79.99
  },
  {
    "title": "Austrian Audio Hi-X65",
    "thumbnail": "https://m.media-amazon.com/images/I/51sacJlbgNS._AC_UL400_.jpg",
    "category": "Headphones",
    "description": "Austrian Audio Hi-X65 Open-Back Reference-Grade Headphones",
    "price": 499.0
  },
  {
    "title": "beyerdynamic DT 700 PRO X",
    "thumbnail": "https://m.media-amazon.com/images/I/61nEHyIC3yL._AC_UL400_.jpg",
    "category": "Headphones",
    "description": "beyerdynamic DT 700 PRO X Closed-Back Studio Headphones with Stellar.45 Driver for Recording and Monitoring on All Playback Devices",
    "price": 299.0
  },
  {
    "title": "OneOdio Wired Headphones",
    "thumbnail": "https://m.media-amazon.com/images/I/71EYvxR33iL._AC_UL400_.jpg",
    "category": "Headphones",
    "description": "OneOdio Wired Headphones - Over Ear Headphones with Noise Isolation Dual Jack Professional Studio Monitor & Mixing Recording Headphones for Guitar Amp Drum Keyboard Podcast PC Computer",
    "price": 33.99
  },
  {
    "title": "Audio-Technica ATH-M50X",
    "thumbnail": "https://m.media-amazon.com/images/I/712j1vD+c8L._AC_UL400_.jpg",
    "category": "Headphones",
    "description": "Audio-Technica ATH-M50X Professional Studio Monitor Headphones, Black, Professional Grade, Critically Acclaimed, with Detachable Cable",
    "price": 149.0
  },
  {
    "title": "OneOdio A71 Hi-Res",
    "thumbnail": "https://m.media-amazon.com/images/I/61x6E4kVXmL._AC_UL400_.jpg",
    "category": "Headphones",
    "description": "OneOdio A71 Hi-Res Studio Recording Headphones - Wired Over Ear Headphones with SharePort, Professional Monitoring & Mixing Foldable Headphones with Stereo Sound (Black)",
    "price": 49.99
  },
  {
    "title": "M-Audio HDH40",
    "thumbnail": "https://m.media-amazon.com/images/I/71V7tJ98roL._AC_UL400_.jpg",
    "category": "Headphones",
    "description": "M-Audio HDH40 – Over Ear Studio Headphones with Closed Back Design, Flexible Headband and 2.7m Cable for Studio Monitoring, Podcasting and Recording",
    "price": 79.0
  },
  {
    "title": "beyerdynamic DT 990 Pro 250 ohm",
    "thumbnail": "https://m.media-amazon.com/images/I/71TahDFRpPL._AC_UL400_.jpg",
    "description": "beyerdynamic DT 990 Pro 250 ohm Over-Ear Studio Headphones",
    "category": "Headphones",
    "price": 199.99
  },
  {
    "title": "M-Audio HDH40 – Over Ear",
    "thumbnail": "https://m.media-amazon.com/images/I/71V7tJ98roL._AC_UL400_.jpg",
    "description": "M-Audio HDH40 – Over Ear Studio Headphones",
    "category": "Headphones",
    "price": 89.99
  },
  {
    "title": "beyerdynamic DT 900 PRO X Open-Back",
    "thumbnail": "https://m.media-amazon.com/images/I/61mv8WlwPlL._AC_UL400_.jpg",
    "description": "beyerdynamic DT 900 PRO X Open-Back Studio Headphones",
    "category": "Headphones",
    "price": 299.99
  },
  {
    "title": "beyerdynamic DT 770 Pro Studio",
    "thumbnail": "https://m.media-amazon.com/images/I/71UiSpcctDL._AC_UL400_.jpg",
    "description": "beyerdynamic DT 770 Pro Studio Headphones",
    "category": "Headphones",
    "price": 149.99
  },
  {
    "title": "OneOdio A71 Hi-Res Studio Recording",
    "thumbnail": "https://m.media-amazon.com/images/I/61x6E4kVXmL._AC_UL400_.jpg",
    "description": "OneOdio A71 Hi-Res Studio Recording Headphones",
    "category": "Headphones",
    "price": 49.99
  },
  {
    "title": "beyerdynamic DT 990 PRO 250 ohm - LIMITED EDITION",
    "thumbnail": "https://m.media-amazon.com/images/I/71R-wfx7w8L._AC_UL400_.jpg",
    "description": "beyerdynamic DT 990 PRO 250 ohm - LIMITED EDITION Headphones",
    "category": "Headphones",
    "price": 179.99
  },
  {
    "title": "beyerdynamic DT 1990 Pro Open Studio",
    "thumbnail": "https://m.media-amazon.com/images/I/71Cn07NisoL._AC_UL400_.jpg",
    "description": "beyerdynamic DT 1990 Pro Open Studio Headphones",
    "category": "Headphones",
    "price": 599.99
  },
  {
    "title": "MAONO 50MM Drivers Studio",
    "thumbnail": "https://m.media-amazon.com/images/I/61VM-ffxm6L._AC_UL400_.jpg",
    "description": "MAONO 50MM Drivers Studio Headphones",
    "category": "Headphones",
    "price": 39.99
  }
]`
const newProductsJson = JSON.parse(newProducts)

newProductsJson.forEach(async product => {
  let { title, thumbnail, description, price, category } = product
  price = Number(price)
  const stock = Math.floor(Math.random() * 50)
  const newObj = { title, description, price, thumbnail, stock, category }
  try {
    await axios.post('/api/products', newObj)
  } catch (error) {
    Logger.error(error.message, 'Error en test post')
  }
})
