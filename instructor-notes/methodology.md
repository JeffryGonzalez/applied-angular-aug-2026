## Your Job 

A developer told me that they feel like their job is now doing code review for AI.

Here's the thing. You cannot do that if what is meant by "code review" is they want someone they can blame if the AI does something "bad". AI is already at the point where the code itself, 98% of the time is probably better in terms of "not blowing up" than I'd write. AI doesn't get index out of range exceptions at anywhere near the same rate we do. 

So yeah, look at the code - make sure you have tests, etc. but unless you were a integral part in making the decisions that provided the understanding the AI used to implement your feature, you are being used as a patsy. A fall-guy(gal), someone to take the blame on something you have no way of verifying. If code review is "this is me saying this code is the right code" ... just be careful.

Let's say that AI gives you an extra four hours a day that used to be spent writing code. Great. But when you were writing that code it wasn't just typing, transcription. You were using code to understand and test your understanding of some objective about the code itself. You could *only* work at the pace of your understanding. If you were working on an Angular form for hiring new developers, and you didn't know what that form was for, how it was supposed to be used, what was required and you just guessed at it all, you were producing "Human Slop". We didn't do much of that, because you'd *stop and ask* - the code would make things you didn't understand legible. "Oh, wait, were we supposed to let them save this form so they can finish it later?", stuff like that. 

AI doesn't work that way unless you can give it that information ahead of time (spec-driven development, or as I like to call it "Waterfall 2.0") or You "pair" with AI to let it be the code snow-blower but only after it is given what it needs to understand what you want, and has a mechanism to bring back questions, to help create clarity.


## This Course
- I have a big NAS (network attached storage - big SSD on the network) that holds 63 repositories from past Angular coures, projects I have created for clients, etc.

- I have ingested all of those into a vector database (PGVector) and created an MCP server so I can ask my local AI questions like: "What's that Angular demo I do about sorting things?" and it can find and show me my code.

I use this as the basis for all my classes. So, a new version of Angular comes out, for example. I can ask Claude (or whatever) "what do I have to update in my courses and demos and stuff based on this change log from Angular?"

Examples:

- get rid of constructor injection, move to inject.
- don't use `@Injectable()` use `@Service()` etc.

What I did for this class (this particular instance of Applied Angular, starting on 8/24/26):

I said "look at what I taught last time for this course and then all the other times I've taught this. Also look at the class I just taught for the first time called "Beginning Angular'" help me:

- find where I should start in this class now.
- what I should go deeper on from that class because it might not be "that easy"
- most importantly, how can I structure the labs and my material such that:
    - Labs are not a "trick' where the students copy and paste stuff and think they've learned something.
    - Labs are not just teaching syntax, or even primarily teaching syntax, they are designed to help developers understand how Angular works within an ecosystem of things like browsers, HTML, CSS, HTTP, bundlers, etc.
        - for example (this is coming later) the way we structure our angular applications and use bundling sort of has nothing to do with Angular itself - it has to do with how the web and browsers work. If you don't know a little of that, you can write perfectly "ok" Angular code that will also (to use the technical term) "Suck".
    - Each of the labs here were hand crafted, custom bespoke to serve a purpose. 
    - Many of them were the result of an hour or so of me experimenting to find the right way in for something, then just saying 'hey, Claude - write this up for me'. I use AI like that all the time. It isn't AI doing the work, it is me using AI to test my thinking, try various things, see which are best, etc.
    - Don't confuse the fact that some of the lab instructions are probably written by Claude, or GPT or whatever.
    - They are mine. 100%. I take full responsibility for them. 

- I think this is what programming is now. If you have AI generate things that aren't the result of a lot of work by you (maybe with AI, certainly with your team) about what you should be building, what approaches should be taken, etc. and just saying "Create me a Netflix clone but for Insurance" You will get something, it will work, but it will suck.
- I think some folks (management, executives, etc.) don't really know the difference. It's ok. We are figuring it out.
- But make sure there IS a difference. Your code needs to get better because of AI. 

If you asked AI to "create me an Angular class that teaches these things" it might have some overlap with this course. That is not what I did, because it wouldn't be *this* course. Learn not to confuse the two or you are saying you are of no value at all within the organization, and that is absolutely WRONG.

Each of the labs here were about 90% conversation, trying different things, and about 10% - "ok, serialize that shared understanding into a lab shape for me". 
