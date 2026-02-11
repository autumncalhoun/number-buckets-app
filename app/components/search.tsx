import SearchSVG from '@/app/svgs/search'

export default function Search({
  value,
  onChange,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
      <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
        <SearchSVG />
      </div>
      <input
        type="text"
        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
        placeholder="Search numbers"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
