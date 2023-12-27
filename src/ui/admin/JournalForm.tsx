"use client";

export default function JournalForm() {
  return (
    <form className="flex flex-col gap-2 p-2">
      <label className="flex flex-col gap-1">
        <span>Title</span>
        <input type="text" className="border border-black" />
      </label>
      <label className="flex flex-col gap-1">
        <span>Tags</span>
        <input type="text" className="border border-black" />
        <ul>
          <li>Tag 1</li>
          <li>Tag 2</li>
          <li>Tag 3</li>
          <li>Tag 4</li>
        </ul>
      </label>
      <label className="flex flex-col gap-1">
        <span>Description</span>
        <textarea className="border border-black" />
        <button>GENERATE DESCRIPTION</button>
      </label>
      <label className="flex flex-col gap-1">
        <span>Material</span>
        <input type="file" className="border border-black" />
      </label>
      <label className="flex flex-col gap-1">
        <span>Content</span>
        <textarea className="border border-black" />
      </label>
      <button className="p-2 font-semibold text-white bg-blue-500">
        Submit
      </button>
      <button className="p-2 font-semibold text-white bg-gray-500">
        Cancel
      </button>
    </form>
  );
}
