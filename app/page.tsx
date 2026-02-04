import HomePage from './components/home'

export default function Home() {
  return (
    <div
      className="flex w-full h-full min-h-screen items-center justify-center  font-sans dark:bg-black p-4"
      style={{
        background: 'linear-gradient(130deg, #f96986 0%, #7b3ffb 100%)',
      }}>
      <main className="flex w-full h-full min-h-96 max-w-3xl flex-col items-center justify-center p-8 bg-white dark:bg-black rounded-2xl shadow">
        <HomePage />
      </main>
    </div>
  )
}
