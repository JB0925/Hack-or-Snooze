"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
let storyFormToggle = false;
let deleteStoryToggle = false;

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// showAddStoryForm and showDeleteStoryForm are used to toggle the display of the
// add and delete story forms when "submit" and "delete" are clicked in the navbar.
// I tried to make this one function since it's essentially the same thing, but 
// could not figure out how to add parameters to the event listeners below.
function showAddStoryForm() {
  if (!storyFormToggle) {
    $storyForm.show();
    $allStoriesList.hide();
    $('#directions').hide();
    storyFormToggle = true;
  } else {
    $storyForm.hide();
    $allStoriesList.show();
    $('#directions').show();
    storyFormToggle = false;
  }
}

function showDeleteStoryForm() {
  if (!deleteStoryToggle) {
    $deleteForm.show();
    $allStoriesList.hide();
    $('#directions').hide();
    deleteStoryToggle = true;
  } else {
    $deleteForm.hide();
    $allStoriesList.show();
    $('#directions').show();
    deleteStoryToggle = false;
  };
};

// event listeners used to control the "submit" and "delete" options in the navbar
$navSubmitStory.on('click', showAddStoryForm);
$navDeleteStory.on('click', showDeleteStoryForm);