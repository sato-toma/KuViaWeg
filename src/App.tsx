import { useState } from 'react'
import './App.css'

function App() {
  const [locationState, setLocationState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [locationMessage, setLocationMessage] = useState('Location stays off until you choose to enable it.')
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState('error')
      setLocationMessage('Location is not available in this browser.')
      return
    }

    setLocationState('loading')
    setLocationMessage('Waiting for a location fix...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationState('ready')
        setLocationMessage('Your position is ready. You can start exploring.')
      },
      (error) => {
        setLocationState('error')
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? 'Location access was denied. You can enable it in browser settings.'
            : 'We could not get a reliable position. Try again somewhere with a clearer sky.',
        )
      },
      { enableHighAccuracy: false, maximumAge: 30_000, timeout: 10_000 },
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">K</div>
        <div>
          <p className="eyebrow">KU VIA WEG</p>
          <p className="brand-name">Walk. Leave a trace.</p>
        </div>
        <button className="icon-button" type="button" aria-label="Open menu">•••</button>
      </header>

      <section className="map-panel" aria-label="Exploration map preview">
        <div className="map-label"><span className="live-dot" /> Map preview</div>
        <div className="map-grid" aria-hidden="true">
          <span className="road road-one" />
          <span className="road road-two" />
          <span className="road road-three" />
          <span className="park park-one" />
          <span className="park park-two" />
          {coordinates && <span className="position-pin" title="Your position" />}
        </div>
        <div className="map-note">
          <span className="compass">N</span>
          {coordinates ? `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}` : 'Position hidden'}
        </div>
      </section>

      <section className="welcome-block">
        <div className="section-kicker">FIRST WALK</div>
        <h1>Make the familiar<br /><em>worth discovering.</em></h1>
        <p className="intro">Your walks build a personal map of places you have really been. Start with your position, then let the road unfold.</p>

        <div className={`location-status status-${locationState}`} role="status">
          <span className="status-icon">{locationState === 'ready' ? '✓' : '⌖'}</span>
          <span>{locationMessage}</span>
        </div>

        <button className="primary-action" type="button" onClick={requestLocation} disabled={locationState === 'loading'}>
          <span>{locationState === 'loading' ? 'Finding you...' : locationState === 'ready' ? 'Refresh position' : 'Enable my position'}</span>
          <span aria-hidden="true">↗</span>
        </button>
        <button className="secondary-action" type="button" disabled={locationState !== 'ready'}>
          Start exploring <span aria-hidden="true">→</span>
        </button>
      </section>

      <footer className="safety-note"><span aria-hidden="true">✦</span> Keep your eyes on the road. KuViaWeg remembers the walk for you.</footer>
    </main>
  )
}

export default App
