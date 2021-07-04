"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let $seeFavoritesList = $('#user-favorites');
let $userStoriesDiv = $('#userStories');
let $userStoriesList = $('#user-stories-list');
let areFavoritesVisible = false;

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
  const showOrHide = currentUser ? 'show-boxes' : 'hide-boxes';
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <input type="checkbox"  class="${showOrHide}" id="button${story.storyId}">
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

// adds a story to the DOM and the API 
// when the submit form is sucessfully submitted
async function addStoryOnFormSubmission(evt) {
  evt.preventDefault();
  let storyObject = {
    title: $submitStoryTitle.val(),
    author: $submitStoryAuthor.val(),
    url: $submitStoryUrl.val()
  };

  await storyList.addStory(currentUser, storyObject);
  let story = generateStoryMarkup((await StoryList.getStories()).stories[0]);
  $allStoriesList.prepend(story);
  clearStorySubmissionInputs($submitStoryAuthor, $submitStoryUrl, $submitStoryTitle);
  $allStoriesList.show();
  $('#directions').show();
  $storyForm.hide();
};

// allows the user to see a list of their favorite stories
// removes unnecessary checkboxes from list of favorites
// and shows the favorite stories div/ol. If favorites are already shown
// and button is clicked, it hides the favorites list and shows the main stories.
function seeListOfFavoriteStories(evt) {
  evt.preventDefault();
  if (!areFavoritesVisible) {
    setupToShowFavorites();
    for (let favorite of currentUser.favorites) {
      const $favorite = generateStoryMarkup(favorite);
      setTimeout(() => {
        let checkboxToRemove = $(`#userStories input[type="checkbox"]`);
        checkboxToRemove.remove();
      },10);
      $userStoriesList.append($favorite);
    };
    $userStoriesDiv.show();
  } else {
    setupToHideFavorites();
  };
};

// deletes a story from the DOM and API, if a story with a matching title is found.
async function deleteAStory(evt) {
  evt.preventDefault();
  let $titleToDelete = $('#delete-title');
  const allStories = await StoryList.getStories();

  for (let story of allStories.stories) {
    await checkIfStoryShouldBeDeleted($titleToDelete, story, currentUser);
  };
  $titleToDelete.val('');
  $allStoriesList.show();
  $deleteForm.hide();
  $('#directions').show();
}

// event listeners to handle what happens when the submit, delete, 
// and "see favorites" buttons are clicked
$storyForm.on('submit', addStoryOnFormSubmission)
$seeFavoritesList.on('click', seeListOfFavoriteStories)
$deleteForm.on('submit', deleteAStory)