"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let $seeFavoritesList = $('#user-favorites');
let $userStoriesDiv = $('#userStories');
let $userStoriesList = $('#user-stories-list');

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <input type="checkbox" id="button${story.storyId}">
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function addStoryOnFormSubmission(evt) {
  evt.preventDefault();
  let storyObject = {
    title: $submitStoryTitle.val(),
    author: $submitStoryAuthor.val(),
    url: $submitStoryUrl.val()
  };
  let newStory = new StoryList([]);
  await newStory.addStory(currentUser, storyObject);
  let story = (await StoryList.getStories()).stories[0];
  story = generateStoryMarkup(story);
  $allStoriesList.prepend(story);
  $submitStoryAuthor.val('');
  $submitStoryUrl.val('');
  $submitStoryTitle.val('');
};

function seeListOfFavoriteStories(evt) {
  evt.preventDefault();
  $userStoriesList.html('');
  let userFavorites = JSON.parse(sessionStorage.getItem('favoriteStories'));
  for (let favorite of userFavorites) {
    let $favorite = new Story(favorite);
    $favorite = generateStoryMarkup($favorite);
    setTimeout(() => {
      let checkboxToRemove = $(`#userStories input[type="checkbox"]`);
      checkboxToRemove.remove();
    },10)
    $userStoriesList.append($favorite);
  }
  $userStoriesDiv.show();
}

function removeFromFavorites(user, id) {
  for (let story of user.favorites) {
    if (story.storyId === id) {
      user.favorites = user.favorites.filter(item => item.storyId !== id);
      sessionStorage.setItem('favoriteStories', JSON.stringify(user.favorites));
    }
  }
} 

async function deleteAStory(evt) {
  evt.preventDefault();
  let $titleToDelete = $('#delete-title');
  const allStories = await StoryList.getStories();
  for (let story of allStories.stories) {
    if ($titleToDelete.val() === story.title) {
      let liToRemove = $(`#${story.storyId}`);
      liToRemove.remove();
      
      try {
        await axios.delete(`${BASE_URL}/stories/${story.storyId}`,
        {params: {token: currentUser.loginToken}});
      } catch(err) {
        alert('Either no title could be matche, or invalid token.');
        return null;
      }
      removeFromFavorites(currentUser, story.storyId);
    }
  }
  $titleToDelete.val('');
}

$storyForm.on('submit', addStoryOnFormSubmission)
$seeFavoritesList.on('click', seeListOfFavoriteStories)
$deleteForm.on('submit', deleteAStory)