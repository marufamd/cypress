<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default defineComponent({
  name: 'MapView',
  emits: ['locationSelected'],
  setup(_, { emit }) {
    onMounted(() => {
      const map = L.map('map').setView([43.6532, -79.3832], 13) // Toronto

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      let marker: L.Marker | null = null

      map.on('click', (e) => {
        const { lat, lng } = e.latlng

        if (marker) {
          marker.setLatLng(e.latlng)
        } else {
          marker = L.marker(e.latlng).addTo(map)
        }

        // Pass coordinates up to parent
        emit('locationSelected', { lat, lng })
      })
    })
  }
})
</script>
