class Item {
    constructor(text) {
        this.text = text
    }
    val() {
        return this.text
    }
}

describe('Add a story to the API', function() {
    const user = {loginToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Implc3NlIiwiaWF0IjoxNjI1MzIxMzMxfQ.D-t8bIsAubq0e9ww15nrJAG3Gh4c6mqbC-iCagflGp0'};

    it('should add a story to the API', async function() {
        let myStories = await StoryList.getStories();
        myStories = myStories.stories;
        let storyList = new StoryList(myStories);
        let {stories} = await StoryList.getStories();
        const length = stories.length;
        await storyList.addStory(user, {title: 'hi', author: 'me', url: 'https://www.espn.com'})
        let stories2 = await StoryList.getStories();
        stories2 = stories2.stories;
        const length2 = stories2.length;
        expect(length2).toBeGreaterThan(length);
    });

    it('should not add a story to the API', async function() {
        let myStories = await StoryList.getStories();
        myStories = myStories.stories;
        let storyList = new StoryList(myStories);
        let {stories} = await StoryList.getStories();
        const length = stories.length;
        await storyList.addStory(user, {title: 'hi', author: 'me', url: 'espn.com'})
        let stories2 = await StoryList.getStories();
        stories2 = stories2.stories;
        const length2 = stories2.length;
        expect(length2).toBe(length);
    });
});

describe('Delete a story from the API', function() {
    const user = {loginToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Implc3NlIiwiaWF0IjoxNjI1MzIxMzMxfQ.D-t8bIsAubq0e9ww15nrJAG3Gh4c6mqbC-iCagflGp0'};
    
    it('should remove a story from the API', async function() {
        let temp = [];
        let {stories} = await StoryList.getStories();
        const length = stories.length
        let myStory = stories[0]
        const itemTitle = new Item('hi');
        checkIfStoryShouldBeDeleted(itemTitle, myStory, user);
        setTimeout(async function() {
            let updatedStories = await StoryList.getStories();
            for (let story of updatedStories.stories) {
                temp.push(story);
            }
        },3000)
        const length2 = temp.length;
        expect(length2).toBeLessThan(length);
    });

    it('should not remove a story from the API', async function() {
        let temp = [];
        let {stories} = await StoryList.getStories();
        const length = stories.length
        let myStory = stories[0]
        const itemTitle = new Item('sdkfhdsfowhf');
        setTimeout(() => {
            checkIfStoryShouldBeDeleted(itemTitle, myStory, user);
        },1000)
        let updatedStories = await StoryList.getStories();
        const length2 = updatedStories.stories.length
        expect(length2).toBe(length);
    })
});

describe('Add to user favorites', function() {
    const user = {
        loginToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Implc3NlIiwiaWF0IjoxNjI1MzIxMzMxfQ.D-t8bIsAubq0e9ww15nrJAG3Gh4c6mqbC-iCagflGp0',
        username: 'jesse',
        favorites: []
    }

    it('should add a story to user favorites', async function() {
        let story = await StoryList.getStories();
        let storyId = story.stories[0].storyId;
        story = {storyId}
        await addToFavorites(user, story, user);
        expect(user.favorites.length).toBe(1);
    })
})

describe('Remove a story from user favorites', function() {
    const user = {
        "username": "jesse",
        "name": "jesse",
        "createdAt": "2021-06-23T17:27:11.857Z",
        "favorites": [
          {
            "storyId": "dfb7ea5a-0304-4092-84ef-edebf5efa945",
            "title": "‘Buffett Indicator’ Warns Stocks Doomed for Worse Crash Than 2008",
            "author": "Elie Schoppik",
            "url": "https://www.ccn.com/buffett-indicator-warns-stocks-doomed-worse-crash-than-2008/",
            "username": "newNew",
            "createdAt": "2021-07-04T00:01:39.736Z"
          }
        ],
        "ownStories": [],
        "loginToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Implc3NlIiwiaWF0IjoxNjI1MzM2OTY4fQ.jbc26pDwcAyDV8ckgScHDz0PCWhZV2cv1Mck2A1_TiE"
    }
    
    it('should remove a story from user favorites', async function() {
        const story = user.favorites[0]
        await removeFromFavorites(user, story, user, story.storyId)
        expect(user.favorites).toEqual([])
    });
})