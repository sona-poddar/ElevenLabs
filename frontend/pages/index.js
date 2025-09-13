import Head from 'next/head'
import Header from '../components/Header'
import TextToSpeech from '../components/TextToSpeech'

export default function Home() {
  return (
    <div>
      <Head>
        <title>ElevenLabs clone — Text to Speech</title>
      </Head>
      <Header />
      <main className="container">
        <h1 className="hero">The most realistic voice AI platform</h1>
        <p className="sub">AI voice models and products powering millions of developers, creators, and enterprises.</p>
        <div className="center">
          <div className="cta-buttons">
            <button className="btn primary">Sign up</button>
            <button className="btn ghost">Contact sales</button>
          </div>
          <TextToSpeech />
        </div>
      </main>
    </div>
  )
}
