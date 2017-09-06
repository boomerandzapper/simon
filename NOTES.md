Had trouble thinking how to implement the 2.5 second delay.

Once I had the initial version working I was worried the history array would get reset if the user made additional clicks while the app was echoing but turns out it uses the original instance of history for the whole callback.

Not sure why there was a bind in the play call but it made the call work differently when wrapped in a function which is needed so I can disable user input while playing back. Removed it and it worked. xD