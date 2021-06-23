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
    title: $submitStoryTitle.value,
    author: $submitStoryAuthor.value,
    url: $submitStoryUrl.value
  };
  
  await storyList.addStory(currentUser, storyObject);
  let story = generateStoryMarkup((await StoryList.getStories()).stories[0]);
  $allStoriesList.prepend(story);
  clearStorySubmissionInputs($submitStoryAuthor, $submitStoryUrl, $submitStoryTitle);
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
    },10);
    $userStoriesList.append($favorite);
  };
  $userStoriesDiv.show();
};

async function deleteAStory(evt) {
  evt.preventDefault();
  let $titleToDelete = $('#delete-title');
  const allStories = await StoryList.getStories();

  for (let story of allStories.stories) {
    await checkIfStoryShouldBeDeleted($titleToDelete, story, currentUser);
  };
  $titleToDelete.val('');
}

$storyForm.on('submit', addStoryOnFormSubmission)
$seeFavoritesList.on('click', seeListOfFavoriteStories)
$deleteForm.on('submit', deleteAStory)