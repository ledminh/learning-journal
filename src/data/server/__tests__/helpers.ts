import { generateJournalEntryDescription } from "../helpers";
import { MaterialType } from "../types/material";

describe("generateJournalEntryDescription", () => {
  it("should generate a description of a quote journal entry", async () => {
    const { errorMessage, payload } = await generateJournalEntryDescription({
      title: "Optimization",
      content:
        "Some thought about it. I think we should not premature optimize, for sure. The reason behind that is we don't know what we are optimizing for. We should optimize for the right thing, not the wrong thing. If we spend time too much on optimize for the wrong thing, is it really optimization at all? We waste our time to gain nothing. However, I don't know why it is the root of all evil. It shouldn't that bad. Maybe it will cause some trouble later on that I don't aware of because I don't have enough experience. I will keep that in mind.",
      material: {
        id: "1",
        type: MaterialType.QUOTE,
        content:
          "Premature optimization is the root of all evil (in programming).",
      },
    });

    expect(errorMessage).toBeNull();
    expect(payload).toBeDefined();
    expect(typeof payload?.description).toBe("string");

    console.log(payload?.description);
  }, 40000);

  it("should generate a description of a code journal entry", async () => {
    const { errorMessage, payload } = await generateJournalEntryDescription({
      title: "Simple Javascript counter",
      content:
        "This is a simple counter written in Javascript. It is a closure. It is a function that return an object with 3 methods: increment, decrement, and getCount. The increment method will increase the count by 1. The decrement method will decrease the count by 1. The getCount method will return the current count. I find it interesting because it demonstrates one of the most important concept in Javascript: closure.",
      material: {
        id: "1",
        type: MaterialType.CODE,
        content: `function createCounter() {
            let count = 0; // This variable is "closed over" by the inner functions
        
            return {
                increment: function() {
                    count += 1;
                    console.log(count);
                },
                decrement: function() {
                    count -= 1;
                    console.log(count);
                },
                getCount: function() {
                    return count;
                }
            };
        }
        
        const counter = createCounter();
        counter.increment(); // Outputs: 1
        counter.increment(); // Outputs: 2
        counter.decrement(); // Outputs: 1
        console.log(counter.getCount()); // Outputs: 1
        `,
      },
    });

    expect(errorMessage).toBeNull();
    expect(payload).toBeDefined();
    expect(typeof payload?.description).toBe("string");

    console.log(payload?.description);
  }, 40000);

  it("should generate a description of an image journal entry", async () => {
    const { errorMessage, payload } = await generateJournalEntryDescription({
      title: "A loyal dog",
      content:
        "This is an image of a dog named “Leao” sits for a second consecutive day at the grave of her owner, who died in the disastrous landslides near Rio de Janiero in 2011. I always love to have a dog one day, just because I read these kind of stories. I think it is a good companion. I don't know if I can take care of it well, but I will try my best. I think it is worth it. However, as some people might say, I might not be ready for it yet. I will keep that in mind.",
      material: {
        id: "1",
        type: MaterialType.IMAGE,
        content:
          "https://static.boredpanda.com/blog/wp-content/uuuploads/powerful-photos/powerful-photos-17.jpg",
      },
    });

    expect(errorMessage).toBeNull();
    expect(payload).toBeDefined();
    expect(typeof payload?.description).toBe("string");

    console.log(payload?.description);
  }, 40000);

  it("should generate a description of a link journal entry", async () => {
    const { errorMessage, payload } = await generateJournalEntryDescription({
      title: "",
      content: "",
      material: {
        id: "1",
        type: MaterialType.LINK,
        content: {
          url: "https://opensource.com/article/18/11/multiple-programming-languages",
          title:
            "How to use multiple programming languages without losing your mind",
          description:
            "A polyglot environment is a double-edged sword, bringing benefits along with complexities that may threaten the organization.",
        },
      },
    });

    expect(errorMessage).toBeNull();
    expect(payload).toBeDefined();
    expect(typeof payload?.description).toBe("string");

    console.log(payload?.description);
  }, 40000);
});
