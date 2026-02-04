import HomePage from './components/home'

export default function Home() {
  return (
    <div
      className="flex w-full h-full items-center justify-center  font-sans dark:bg-black p-4"
      style={{
        background: 'linear-gradient(130deg, #f96986 0%, #7b3ffb 100%)',
      }}>
      <main className="flex w-full h-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black rounded-2xl shadow">
        <HomePage />
      </main>
    </div>
  )
}
