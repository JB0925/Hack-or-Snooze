const setupAddOrRemoveFavorites = (evt) => {
    const checkboxId = evt.target.id;
    const checkbox = $(`#${checkboxId}`).eq(0);
    const parentId = evt.target.parentElement.id;
    return {checkboxId, checkbox, parentId}
}

function removeFromFavorites(user, id) {
    for (let story of user.favorites) {
      if (story.storyId === id) {
        user.favorites = user.favorites.filter(item => item.storyId !== id);
        sessionStorage.setItem('favoriteStories', JSON.stringify(user.favorites));
      };
    };
}; 
  
function addToFavorites(user, story) {
  user.favorites.push(story);
  sessionStorage.setItem('favoriteStories', JSON.stringify(user.favorites));
};

async function checkIfStoryShouldBeDeleted(itemTitle, story, user) {
if (itemTitle.val() === story.title) {
    let liToRemove = $(`#${story.storyId}`);
    liToRemove.remove();
    
    try {
        await axios.delete(`${BASE_URL}/stories/${story.storyId}`,
        {params: {token: user.loginToken}});
    } catch(err) {
        alert('Either no title could be matche, or invalid token.');
        return null;
    }
    removeFromFavorites(user, story.storyId);
    };
};

function clearStorySubmissionInputs(input1, input2, input3) {
    input1.value = '';
    input2.value = '';
    input3.value = '';
};