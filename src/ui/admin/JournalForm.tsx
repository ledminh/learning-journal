"use client";

export default function JournalForm() {
  return (
    <form className="flex flex-col gap-10 p-4 border border-black rounded-md shadow-lg">
      <label className="flex flex-col gap-1">
        <span className="text-xl font-semibold">Title</span>
        <input
          type="text"
          className="p-2 text-xl border border-black rounded-md"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Tags</span>
        <input type="text" className="p-2 border border-black rounded-md" />
        <ul className="flex flex-wrap gap-2 p-2 bg-blue-200 rounded-lg">
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              className="inline-block px-2 py-1 text-sm font-semibold border border-black rounded-md hover:border-blue-600 hover:shadow-md"
              key={i}
            >
              <span>Tag {i + 1}</span>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-4 h-4 ml-2 hover:text-red-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.707 10l4.147 4.146a.5.5 0 01-.708.708L10 10.707l-4.146 4.147a.5.5 0 11-.708-.708L9.293 10 5.146 5.854a.5.5 0 11.708-.708L10 9.293l4.146-4.147a.5.5 0 11.708.708L10.707 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Description</span>
        <textarea
          className="p-2 text-sm bg-gray-300 border border-black resize-none"
          rows={5}
        />
        <div className="flex justify-end">
          <button className="px-2 py-1 text-white bg-gray-700 rounded-md shadow-md hover:bg-gray-900">
            GENERATE DESCRIPTION
          </button>
        </div>
      </label>
      <label className="flex flex-col gap-4 p-2 border-2 border-black rounded-lg shadow-lg">
        <span className="font-semibold border-b-2 border-b-black">
          Material
        </span>
        <ul className="flex gap-2">
          {["QUOTE", "CODE", "LINK", "IMAGE"].map((type, i) => (
            <li
              key={i}
              className="px-2 border border-black rounded-md hover:bg-slate-600 hover:text-gray-200"
            >
              <button>{type}</button>
            </li>
          ))}
        </ul>
        <input type="file" className="border border-black" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Content</span>
        <textarea
          className="p-2 bg-gray-100 border border-black resize-none"
          rows={15}
        />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <button className="p-2 font-semibold text-white bg-blue-500 sm:basis-1/2">
          Submit
        </button>
        <button className="p-2 font-semibold text-white bg-gray-500 sm:basis-1/2">
          Cancel
        </button>
      </div>
    </form>
  );
}
