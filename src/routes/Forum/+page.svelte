<script>
  import { auth, db, doc, deleteDoc, collection } from "$lib/API/Firebase";
  import {
    addDoc,
    updateDoc,
    arrayUnion,
    getDoc,
    onSnapshot,
    query,
    orderBy,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import UserNavbar from "$lib/Common/UserNavbar.svelte";
  import Navbar from "$lib/Common/Navbar.svelte";
  import Footer from "$lib/Common/Footer.svelte";

  let questions = writable([]);

  let title = "";
  let description = "";
  let currentUser = null;
  let page = "Questions";

  let unsubscribe = null;

  onMount(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      currentUser = user;
      if (user) {
        console.log(`User logged in: ${user.email}`);
      } else {
        console.log("No user logged in");
        localStorage.removeItem("firebaseUser");
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribe) unsubscribe();
    };
  });

  onMount(() => {
    const q = query(collection(db, "questions"), orderBy("timestamp", "desc"));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedQuestions = snapshot.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp
            ? data.timestamp.toDate()
            : new Date();
          const replies = data.replies || [];
          return { id: doc.id, ...data, timestamp, replies };
        });
        questions.set(fetchedQuestions);
      },
      (error) => {
        console.error("Error fetching questions: ", error);
      }
    );
  });

  const postQuestion = async () => {
    if (!currentUser) {
      alert("You must be logged in to post a question.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert("Title and Description cannot be empty.");
      return;
    }

    try {
      await addDoc(collection(db, "questions"), {
        title: title.trim(),
        description: description.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        timestamp: new Date(),
        likes: [],
        dislikes: [],
        replies: [],
      });
      title = "";
      description = "";
    } catch (error) {
      console.error("Error posting question: ", error);
    }
  };

  const handleLike = async (question) => {
    if (!currentUser) {
      alert("You must be logged in to like a question.");
      return;
    }

    const questionRef = doc(db, "questions", question.id);
    const newLikes = [...question.likes];
    const newDislikes = [...question.dislikes];

    if (!question.likes.includes(currentUser.uid)) {
      newLikes.push(currentUser.uid);
      const dislikeIndex = newDislikes.indexOf(currentUser.uid);
      if (dislikeIndex > -1) {
        newDislikes.splice(dislikeIndex, 1);
      }
    } else {
      const likeIndex = newLikes.indexOf(currentUser.uid);
      if (likeIndex > -1) {
        newLikes.splice(likeIndex, 1);
      }
    }

    try {
      await updateDoc(questionRef, {
        likes: newLikes,
        dislikes: newDislikes,
      });
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  const handleDislike = async (question) => {
    if (!currentUser) {
      alert("You must be logged in to dislike a question.");
      return;
    }

    const questionRef = doc(db, "questions", question.id);
    const newLikes = [...question.likes];
    const newDislikes = [...question.dislikes];

    if (!question.dislikes.includes(currentUser.uid)) {
      newDislikes.push(currentUser.uid);
      const likeIndex = newLikes.indexOf(currentUser.uid);
      if (likeIndex > -1) {
        newLikes.splice(likeIndex, 1);
      }
    } else {
      const dislikeIndex = newDislikes.indexOf(currentUser.uid);
      if (dislikeIndex > -1) {
        newDislikes.splice(dislikeIndex, 1);
      }
    }

    try {
      await updateDoc(questionRef, {
        likes: newLikes,
        dislikes: newDislikes,
      });
    } catch (error) {
      console.error("Error updating dislikes: ", error);
    }
  };

  const handleReply = async (question, replyContent) => {
    if (!currentUser) {
      alert("You must be logged in to reply.");
      return;
    }

    if (!replyContent.trim()) {
      alert("Reply cannot be empty.");
      return;
    }

    const questionRef = doc(db, "questions", question.id);
    const newReply = {
      replyId: Math.random().toString(36).substring(2, 15),
      content: replyContent.trim(),
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      timestamp: new Date(),
    };

    try {
      await updateDoc(questionRef, {
        replies: arrayUnion(newReply),
      });
    } catch (error) {
      console.error("Error adding reply: ", error);
    }
  };

  async function deleteQuestion(questionId) {
    try {
      const questionDocRef = doc(db, "questions", questionId);
      await deleteDoc(questionDocRef);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  }

  async function deleteReply(questionId, replyId) {
    try {
      const questionDocRef = doc(db, "questions", questionId);
      const questionDoc = await getDoc(questionDocRef);
      const questionData = questionDoc.data();
      let replies = questionData.replies || [];
      const replyIndex = replies.findIndex(
        (reply) => reply.replyId === replyId
      );
      if (replyIndex !== -1) {
        replies.splice(replyIndex, 1);
        await updateDoc(questionDocRef, {
          replies: replies,
        });
      } else {
        console.error("Reply not found");
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  }
</script>

<main>
  {#if currentUser}
    <UserNavbar
      on:logout={() => {
        window.location.href = "/";
      }}
    />
  {:else}
    <Navbar />
  {/if}

  <nav class="navbar">
    <button
      on:click={() => {
        page = "Post";
      }}><i class="fa fa-pencil"></i></button
    >
    <button
      on:click={() => {
        page = "Question";
      }}><i class="fa fa-comments-o"></i></button
    >
  </nav>

  <br /><br /><br />
  {#if page == "Post"}
    <section class="post">
      <header>
        <h2>Create New Post</h2>
        <button
          on:click={() => {
            page = "Question";
          }}>View Forum</button
        >
      </header>
      <input bind:value={title} placeholder="Enter title..." />
      <textarea bind:value={description} placeholder="Enter description..."
      ></textarea>
      <button on:click={postQuestion}>Post Question</button>
    </section>
  {:else}
    <section>
      <header>
        <h2>Recent Posts</h2>
        <button
          on:click={() => {
            page = "Post";
          }}>Post New Question</button
        >
      </header>
      {#if $questions.length === 0}
        <p>No questions have been posted yet.</p>
      {/if}
      <ul>
        {#each $questions as question (question.id)}
          <li>
            <header>
              <span><b>Posted By:</b> {question.userName}</span>
              <span style="margin-left: auto;"
                ><b>Posted On:</b> {question.timestamp.toLocaleString()}</span
              >
              {#if question.userId == currentUser?.uid}
                <button on:click={() => deleteQuestion(question.id)}
                  ><i class="fa fa-trash-o" style="font-size: 20px;"
                  ></i></button
                >
              {/if}
            </header>
            <br />
            <div style="width: calc(100% - 235px);float: left">
              <h3>{question.title}</h3>
              <p style="padding-right: 50px;">{question.description}</p>
            </div>
            <div style="width: 230px; float: left; margin-bottom: 30px;">
              <p>
                <span style="font-size: 20px; margin-left: 10px;"
                  ><i class="fa fa-thumbs-up"></i>
                  {question.likes.length}</span
                ><span style="margin-left: 22px; margin-right: 20px;">|</span>
                <span style="font-size: 20px;"
                  ><i class="fa fa-thumbs-down"></i>
                  {question.dislikes.length}</span
                >
              </p>
              <button on:click={() => handleLike(question)}>
                {question.likes.includes(currentUser?.uid) ? "Unlike" : "Like"}
              </button>
              <button on:click={() => handleDislike(question)}>
                {question.dislikes.includes(currentUser?.uid)
                  ? "Remove Dislike"
                  : "Dislike"}
              </button>
            </div>
            {#if question.replies && question.replies.length > 0}
              <div class="replies">
                <h4>
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <i
                    class="arrow down"
                    on:click={(event) => {
                      let button = event.target;
                      if (
                        button.parentElement.nextElementSibling.style.display ==
                        "none"
                      ) {
                        button.parentElement.nextElementSibling.style.display =
                          "block";
                        button.classList.remove("right");
                        button.classList.add("down");
                      } else {
                        button.parentElement.nextElementSibling.style.display =
                          "none";
                        button.classList.remove("down");
                        button.classList.add("right");
                      }
                    }}
                  ></i>
                  <span style="margin-left: 10px;">Replies:</span>
                </h4>
                <ul>
                  {#each question.replies as reply (reply.replyId)}
                    <li>
                      <header>
                        <span><b>Reply By:</b> {reply.userName}</span>
                        <span style="margin-left: auto;"
                          ><b>Posted On:</b>
                          {reply.timestamp.toDate().toLocaleString()}</span
                        >
                        {#if reply.userId == currentUser?.uid}
                          <button
                            on:click={() =>
                              deleteReply(question.id, reply.replyId)}
                            ><i class="fa fa-trash-o" style="font-size: 20px;"
                            ></i></button
                          >
                        {/if}
                      </header>
                      <p>{reply.content}</p>
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
            <div class="reply-form">
              <input
                type="text"
                placeholder="Write a reply..."
                bind:value={question.replyInput}
                on:input={(e) => (question.replyInput = e.target.value)}
                on:keyup={(event) => {
                  if (event.key == "Enter") {
                    handleReply(question, question.replyInput);
                    question.replyInput = "";
                  }
                }}
              />
              <button
                on:click={() => {
                  handleReply(question, question.replyInput);
                  question.replyInput = "";
                }}>Reply</button
              >
            </div>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</main>
<Footer />

<style>
  main {
    min-height: calc(100vh - 80px);
    font-family: SUSE, sans-serif;
  }

  .navbar {
    width: 100px;
    position: fixed;
    z-index: 10;
    left: 0;
    top: 20vh;
    border-radius: 10px;
    background-color: #c4dad2;
  }

  .navbar button {
    width: 100%;
    border-radius: 10px;
    border: none;
    background-color: #c4dad2;
    padding: 10px;
    height: 75px;
    font-size: 30px;
    color: #16423c;
  }

  .navbar button:hover {
    background-color: #16423c;
    color: #c4dad2;
  }

  section {
    margin-left: 125px;
    margin-right: 50px;
  }

  header {
    display: flex;
  }

  header h2 {
    font-size: 30px;
    color: #16423c;
    font-weight: 600;
  }

  button {
    margin-left: auto;
    margin-top: auto;
    margin-bottom: auto;
    border: 2px solid #16423c;
    background-color: #c4dad2;
    color: #16423c;
    font-size: 15px;
    font-family: inherit;
    padding: 10px;
    border-radius: 10px;
  }

  button:hover {
    background-color: #16423c;
    color: #c4dad2;
  }

  input,
  textarea {
    display: block;
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  button {
    padding: 8px 16px;
    margin-right: 10px;
    cursor: pointer;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  li {
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 10px;
    background-color: #e9efec;
    border: 2px solid #16423c;
    color: #16423c;
  }

  li h3 {
    font-size: 22px;
  }

  .replies {
    padding-left: 20px;
    border-left: 2px solid #c4dad2;
    float: left;
    margin-bottom: 20px;
    min-width: 50vw;
  }

  .reply-form {
    display: flex;
    width: 100%;
    height: 60px;
  }

  .reply-form input {
    margin: auto;
    border-radius: 10px;
    border: none;
    margin-right: 30px;
    height: 50px;
    font-size: 15px;
    font-family: inherit;
    color: #16423c;
  }

  .reply-form button {
    height: 50px;
    width: 100px;
    font-size: 18px;
  }

  ::placeholder {
    font-family: inherit;
    color: #16423c;
  }

  .post input {
    margin: auto;
    border-radius: 10px;
    border: 2px solid #16423c;
    margin-right: 30px;
    height: 50px;
    font-size: 15px;
    font-family: inherit;
    color: #16423c;
  }

  .post textarea {
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 10px 10px 0px 10px;
    border: 2px solid #16423c;
    margin-right: 30px;
    height: 70px;
    min-height: 70px;
    max-height: 200px;
    min-width: 100%;
    max-width: 100%;
    font-size: 15px;
    font-family: inherit;
    color: #16423c;
  }

  .arrow {
    border: solid black;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
  }

  .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }

  .down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
</style>
