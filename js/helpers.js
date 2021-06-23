// returns an object that is destructured; used to declutter code in a function.
const setupAddOrRemoveFavorites = (evt) => {
    const checkboxId = evt.target.id;
    const checkbox = $(`#${checkboxId}`).eq(0);
    const parentId = evt.target.parentElement.id;
    return {checkboxId, checkbox, parentId}
}

// again, used to make code more compact in another function. Removes a story
// from favorites.
function removeFromFavorites(user, id) {
    for (let story of user.favorites) {
      if (story.storyId === id) {
        user.favorites = user.favorites.filter(item => item.storyId !== id);
        sessionStorage.setItem('favoriteStories', JSON.stringify(user.favorites));
      };
    };
}; 

// same as above, but this time adds a story to favorites.
function addToFavorites(user, story) {
  user.favorites.push(story);
  sessionStorage.setItem('favoriteStories', JSON.stringify(user.favorites));
};

// used to run through stories on page. If id matches, story is deleted from the
// DOM and from the API.
async function checkIfStoryShouldBeDeleted(itemTitle, story, user) {
if (itemTitle.val() === story.title) {
    let liToRemove = $(`#${story.storyId}`);
    liToRemove.remove();
    
    try {
        await axios.delete(`${BASE_URL}/stories/${story.storyId}`,
        {params: {token: user.loginToken}});
    } catch(err) {
        alert('Either no title could be matched, or invalid token.');
        return null;
    }
    removeFromFavorites(user, story.storyId);
    };
};

// small helper to clear submit form inputs.
function clearStorySubmissionInputs(input1, input2, input3) {
    input1.val('');
    input2.val('');
    input3.val('');
};