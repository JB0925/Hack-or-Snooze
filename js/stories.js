"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let liCount = 0

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
  liCount++
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <input type="checkbox" id="${liCount}">
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
  console.log($submitStoryUrl.val())
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
};

$storyForm.on('submit', addStoryOnFormSubmission)