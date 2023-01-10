# tic-tac-toe

Game of Tic Tac Toe for the Odin Project.

Required to have as little variables and functions in the global scope and to use modules and factory functions. This was done here and the js was also split between two files (for two html files), passing variables through the session storage.

- made changes after checking on iphone - remember to specify colors for buttons and form elements, the default in chrome is usually black, but on safari its blue.

ISSUES:

- the JS was not unified into one file for clarity but also because putting it together resulted in errors as the js tried to query select items that werent on the page itself. Possibly can circumvent this with modules or having a file for specific page related queries and the rest is on modules, unclear for now how to solve this.
- deciding where to place each function - gameboard, player, game etc - was more challenging than i thought it would be, and I had to move some around. Not sure how to solve that, possible the categories I made weren't good enough, also possibly needed more of them or simply more practice. It felt a little disorganized.
- there is not enough pazzaz around the winner and loser of each round and finally the game, also the message disappears too quickly. This can be changed but probably will not in this version.
  (- did not create the unbeatable minimax algorythem)
- when looking on iphone the css background doesnt stretch all the way to the top and bottom, not sure how to fix this. possible with color it works but not with image but either way it's something to fix in next projects.

GOOD:

- gotten better at styling and using generalized CSS and classes, it could get even better, but this styling is coherent and simple, but looks good nonetheless.
- Created the background images myself using fonts from fontspace and figma, with the bg texture from Textures.com, it took some time but the result is clean and handy to change.
- the css change from big to small screen is done almost entirely without media queries, relying on clamp and such, it is a much smoother interface than previous ones.
- learned to use setTimeout and used it to make the ai movements slower and easier to follow.
- created basic and intermediate ai of my own without using the minimax algorythem, and letting the user choose the levels.
- the interface allows human/human ai/ai and ai/human games.
