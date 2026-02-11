export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded">
      {children}
    </button>
  )
}
