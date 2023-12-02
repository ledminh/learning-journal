export default function Summary() {
  return (
    <Wrapper>
      <p>Date</p>
      <h2>Entry Title</h2>
      <p>Tags</p>
      <p>Link/Quote/Code/Image</p>
      <p>
        Some description here. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Quisquam voluptatum, quia, quod, voluptates tempora
        doloremque quos dolorum.
      </p>
    </Wrapper>
  );
}

/*******************
 * Components
 */

const Wrapper = (props: { children: React.ReactNode }) => (
  <div className="border border-slate-400 p-2">{props.children}</div>
);
