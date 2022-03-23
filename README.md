## Running the Code

For this, you need to serve the static files using any server. eg.

-	If you are using VS Code, you can use the 'live server' plugin. [Link](https://www.freecodecamp.org/news/vscode-live-server-auto-refresh-browser/)
-	Install Python3 (if not available).
-   Run `cd Source\ Code/`
-	Run command `python3 -m http.server`

## How to use the project?

For details on how to use the project refer to the PDF `CS 606 T2 2021-22 Assignment 2.pdf`

(Or)

Watch the Video - `video.mp4` in folder `DemoVideo`

- Mode-1 for Top View
- Mode-2 for 3D View

### Key Bindings
| Key Binding | Description                                                       |
| :----:      | ----------------------------------                                |
| m           | Switch between Top View or 3D View                                |
| Arrow UP    | Translate along y-axis                                            |
| Arrow DOWN  | Translate along negative y-axis                                   |
| Arrow RIGHT | Translate along x-axis                                            |
| Arrow LEFT  | Translate along negative x-axis                                   |
| p           | Translate along positive z-axis                                   |
| o           | Translate along negative z-axis                                   |
| q           | Inc. rotation angle  about the x-axis                             |
| w           | Dec. rotation angle  about the x-axis                             |
| a           | Inc. rotation angle  about the y-axis                             |
| s           | Dec. rotation angle  about the y-axis                             |
| z           | Inc. rotation angle  about the z-axis                             |
| x           | Dec. rotation angle  about the z-axis                             |
| +           | Scale UP                                                          |
| -           | Scale DOWN                                                        |
| [           | Zooming camera in                                                 |
| ]           | Zooming camera out                                                |
| j           | Selects the rotation axis of camera as x-axis when using mouse    |
| k           | Selects the rotation axis of camera as y-axis when using mouse    |
| l           | Selects the rotation axis of camera as z-axis when using mouse    |
| y           | Switch Animation mode on or off (Will work in top view mode only) |
| 1           | Inc. the speed of the animation                                   |
| 2           | Dec. the speed of the animation                                   |

## Answer to Questions

Refer to `Report.pdf` in folder `Report`

## Screenshot

Screenshots after different modes are in folder `Screenshots`

## Assumptions

- Assumed Different colors for shapes and the selected shape.
- Assume the current position of the selected object is p0.
- We assume t1 to be 0.5 (value of t corresponding to p1).
- Assumed that p0, p1, p2 are not collinear and not too close to each other.
- Key Bindings are unique.