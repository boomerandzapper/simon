Had trouble thinking how to implement the 2.5 second delay.

Once I had the initial version working I was worried the history array would get reset if the user made additional clicks while the app was echoing but turns out it uses the original instance of history for the whole callback.

Not sure why there was a bind in the play call but it made the call work differently when wrapped in a function which is needed so I can disable user input while playing back. Removed it and it worked. xD
-They actually served the same purpose, so doing both made it break

Rapidly clicking the switch button would cause app to break so I just disabled it. Also disabled boxes when "Simon" was playing.

Front end stuff pretty ugly, but would use bootstrap or something similiar if production.