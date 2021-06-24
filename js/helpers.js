// returns an object that is eventually destructured; used to declutter code in a function.
const setupAddOrRemoveFavorites = (evt) => {
    const checkboxId = evt.target.id;
    const checkbox = $(`#${checkboxId}`).eq(0);
    const parentId = evt.target.parentElement.id;
    return {checkboxId, checkbox, parentId}
}

// again, used to make code more compact in another function. Removes a story
// from favorites.
async function removeFromFavorites(user, story, instance, id) {
  await axios.delete(`${BASE_URL}/users/${user.username}/favorites/${story.storyId}`,
  {params: {token: user.loginToken}})
  instance.favorites = instance.favorites.filter(item => item.storyId !== id);
}; 

// same as above, but this time adds a story to favorites.
async function addToFavorites(user, story, instance) {
  await axios.post(`${BASE_URL}/users/${user.username}/favorites/${story.storyId}`,
  {token: user.loginToken});
  instance.favorites.push(story);
};

// used to run through stories on page. If title matches the input value, story is deleted from the
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
  };
};

// small helper to clear submit form inputs.
function clearStorySubmissionInputs(input1, input2, input3) {
    input1.val('');
    input2.val('');
    input3.val('');
};