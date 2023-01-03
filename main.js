var id;
var end = false;
var time_out = 800;

var direction = 4;
var head_pos = { top: 0, left: 0 };
var setBlock = false;
var setBlockPosition = { top: 0, left: 0 };
var setBlockCount = 0;
var score = 0;

var directionOr = 2;
var head_posOr = { top: 0, left: 0 }; // to change
var setBlockOr = false;
var setBlockPositionOr = { top: 0, left: 0 };
var setBlockCountOr = 0;
var scoreOr = 0;

$(document).ready(main);

function main() {
        $("#start").click(start);
}


function start() {
        $("#start").hide();
        socket.emit("ready-to-start", $('#prev').text());
        score = 0;
        $("#score").text(score);
        if (end) {
                $("#snake").empty();
                $("#snake").append(
                        $("<div/>", {
                                class: "snake-node",
                                css: { top: 4, left: 4 },
                        })
                );
                $("#snake").append(
                        $("<div/>", {
                                class: "con connector-v",
                                css: { top: 16, left: 4 },
                        })
                );
                $("#snake").append(
                        $("<div/>", {
                                class: "snake-node",
                                css: { top: 24, left: 4 },
                        })
                );

		$("#snake-or").empty();
                $("#snake-or").append(
                        $("<div/>", {
                                class: "snake-node-or",
                                css: { top: 404, left: 404 },
                        })
                );
                $("#snake-or").append(
                        $("<div/>", {
                                class: "con-or connector-v-or",
                                css: { top: 392, left: 404 },
                        })
                );
                $("#snake-or").append(
                        $("<div/>", {
                                class: "snake-node-or",
                                css: { top: 384, left: 404 },
                        })
                );

                time_out = 800;
                direction = 4;
		directionOr = 2;
                end = false;
        }
        document.onkeydown = function (e) {
                var new_dir = e.keyCode - 36;
                if (new_dir >= 1 && new_dir <= 4) {
                        if (
                                (direction === 1 && new_dir !== 3) ||
                                (direction === 3 && new_dir !== 1) ||
                                (direction === 2 && new_dir !== 4) ||
                                (direction === 4 && new_dir !== 2)
                        ) {
                                direction = new_dir;
                        }
                }

                if (new_dir === -4 && setBlock === true) {
                        setBlock = false;
			setBlockCount = 3;
                }

		// a65, w87, d68, s83
		var Or_new_dir = e.keyCode;
		if (Or_new_dir === 87 && directionOr !== 4) {
			directionOr = 2;
		} else if (Or_new_dir === 65 && directionOr !== 3) {
			directionOr = 1;
		} else if (Or_new_dir === 83 && directionOr !== 2) {
			directionOr = 4;
		} else if (Or_new_dir === 68 && directionOr !== 1) {
			directionOr = 3;
		}
		
		
		if (Or_new_dir === 70 && setBlockOr === true) {
			setBlockOr = false;
			setBlockCountOr = 3;
		}
        };

        head_pos.top = $(".snake-node").last().position().top;
        head_pos.left = $(".snake-node").last().position().left;

	head_posOr.top = $(".snake-node-or").last().position().top;
	head_posOr.left = $(".snake-node-or").last().position().left;

        prepareFood();
	prepareCube();
        callback();
}

function callback() {
        move();
        if (end) {
                return;
        }
        id = setTimeout(callback, time_out);
}

function move() {
        var new_head, new_connector, new_headOr, new_connectorOr;
        switch (direction) {
                case 2: // up
                        new_connector = $("<div/>", {
                                class: "con connector-v",
                                css: {
                                        top: head_pos.top - 8,
                                        left: head_pos.left,
                                },
                        });
                        head_pos.top -= 20;
                        break;

                case 1: // left
                        new_connector = $("<div/>", {
                                class: "con connector-h",
                                css: {
                                        top: head_pos.top,
                                        left: head_pos.left - 8,
                                },
                        });
                        head_pos.left -= 20;
                        break;

                case 4: // down
                        new_connector = $("<div/>", {
                                class: "con connector-v",
                                css: {
                                        top: head_pos.top + 12,
                                        left: head_pos.left,
                                },
                        });
                        head_pos.top += 20;
                        break;

                case 3: // right
                        new_connector = $("<div/>", {
                                class: "con connector-h",
                                css: {
                                        top: head_pos.top,
                                        left: head_pos.left + 12,
                                },
                        });
                        head_pos.left += 20;
                        break;
        }

	switch (directionOr) {
                case 2: // up
                        new_connectorOr = $("<div/>", {
                                class: "con-or connector-v-or",
                                css: {
                                        top: head_posOr.top - 8,
                                        left: head_posOr.left,
                                },
                        });
                        head_posOr.top -= 20;
                        break;

                case 1: // left
                        new_connectorOr = $("<div/>", {
                                class: "con-or connector-h-or",
                                css: {
                                        top: head_posOr.top,
                                        left: head_posOr.left - 8,
                                },
                        });
                        head_posOr.left -= 20;
                        break;

                case 4: // down
                        new_connectorOr = $("<div/>", {
                                class: "con-or connector-v-or",
                                css: {
                                        top: head_posOr.top + 12,
                                        left: head_posOr.left,
                                },
                        });
                        head_posOr.top += 20;
                        break;

                case 3: // right
                        new_connectorOr = $("<div/>", {
                                class: "con-or connector-h-or",
                                css: {
                                        top: head_posOr.top,
                                        left: head_posOr.left + 12,
                                },
                        });
                        head_posOr.left += 20;
                        break;
        }

        new_head = $("<div/>", {
                class: "snake-node",
                css: {
                        top: head_pos.top,
                        left: head_pos.left,
                },
        });

	new_headOr = $("<div/>", {
                class: "snake-node-or",
                css: {
                        top: head_posOr.top,
                        left: head_posOr.left,
                },
        });

	if (setBlockCount > 0) {
		console.log("setBlock triggered");

		var newBlock = $("<div/>", {
			class: "block",
			css: {
				top: setBlockPosition.top,
				left: setBlockPosition.left,
			},
		});

		$("#block").append(newBlock);
		setBlockCount--;
	}

	if (setBlockCountOr > 0) {
		console.log("setBlock triggered");

		var newBlock = $("<div/>", {
			class: "block",
			css: {
				top: setBlockPositionOr.top,
				left: setBlockPositionOr.left,
			},
		});

		$("#block").append(newBlock);
		setBlockCountOr--;
	}

        if (hitFood()) {
                score++;
                if (time_out > 100) {
                        time_out -= 6;
                }
                $("#score").text(score);
                prepareFood();
	} else if (hitCube()) {
		console.log("hit cube\n");
		setBlock = true;
		setBlockPosition.top = $(".snake-node").last().position().top;
		setBlockPosition.left = $(".snake-node").last().position().left;
		$(".snake-node")[0].remove();
                $(".con")[0].remove();
		prepareCube();
        } else {
		setBlockPosition.top = $(".snake-node").last().position().top;
		setBlockPosition.left = $(".snake-node").last().position().left;
                $(".snake-node")[0].remove();
                $(".con")[0].remove();
	}
        $("#snake").append(new_connector);

	if (hitFoodOr()) {
                scoreOr++;
                if (time_out > 100) {
                        time_out -= 6;
                }
                $("#scoreOr").text(scoreOr);
                prepareFood();
	} else if (hitCubeOr()) {
		console.log("hit cube\n");
		setBlockOr = true;
		setBlockPositionOr.top = $(".snake-node-or").last().position().top;
		setBlockPositionOr.left = $(".snake-node-or").last().position().left;
		$(".snake-node-or")[0].remove();
                $(".con-or")[0].remove();
		prepareCube();
        } else {
		setBlockPositionOr.top = $(".snake-node-or").last().position().top;
		setBlockPositionOr.left = $(".snake-node-or").last().position().left;
                $(".snake-node-or")[0].remove();
                $(".con-or")[0].remove();
	}
        $("#snake-or").append(new_connectorOr);

        if (hitWall() || hitSelf() || hitBlock() || hitOther()) {
                endgame();
                return;
        }

	if (hitWallOr() || hitSelfOr() || hitBlockOr() || hitOtherOr()) {
                endgame();
                return;
        }

        $("#snake").append(new_head);
	$("#snake-or").append(new_headOr);
}

function prepareFood() {
        var x = Math.floor(Math.random() * 21) * 20 + 4;
        var y = Math.floor(Math.random() * 21) * 20 + 4;
	// var z = Math.floor(Math.random() * 10);
        if (
                y === $("#food").position().top &&
                x === $("#food").position().left
        ) {
                return prepareFood();
        }
        if (y === head_pos.top && x === head_pos.left) {
                return prepareFood();
        }
        var nodes = $(".snake-node").first();
        while (nodes.length !== 0) {
                if (nodes.position().left === x && nodes.position().top === y) {
                        return prepareFood();
                }
                nodes = nodes.next().next();
        }

	$("#food").css({ top: y, left: x });

	// if (z >= 5) {
	// 	$("#food").css({ top: y, left: x });
	// } else {
	// 	$("#cube").css({ top: y, left: x });
	// }
}

function prepareCube() {
        var x = Math.floor(Math.random() * 21) * 20 + 4;
        var y = Math.floor(Math.random() * 21) * 20 + 4;
	// var z = Math.floor(Math.random() * 10);
        if (
                y === $("#food").position().top &&
                x === $("#food").position().left
        ) {
                return prepareCube();
        }
        if (y === head_pos.top && x === head_pos.left) {
                return prepareCube();
        }
        var nodes = $(".snake-node").first();
        while (nodes.length !== 0) {
                if (nodes.position().left === x && nodes.position().top === y) {
                        return prepareCube();
                }
                nodes = nodes.next().next();
        }

	$("#cube").css({ top: y, left: x });

	// if (z >= 5) {
	// 	$("#food").css({ top: y, left: x });
	// } else {
	// 	$("#cube").css({ top: y, left: x });
	// }
}

function hitFood() {
        return (
                head_pos.top === $("#food").position().top &&
                head_pos.left === $("#food").position().left
        );
}

function hitFoodOr() {
        return (
                head_posOr.top === $("#food").position().top &&
                head_posOr.left === $("#food").position().left
        );
}

function hitCube() {
	return (
		head_pos.top === $("#cube").position().top &&
                head_pos.left === $("#cube").position().left
	);
}

function hitCubeOr() {
	return (
		head_posOr.top === $("#cube").position().top &&
                head_posOr.left === $("#cube").position().left
	);
}

function hitWall() {
        return (
                head_pos.top < 0 ||
                head_pos.top > 420 ||
                head_pos.left < 0 ||
                head_pos.left > 420
        );
}

function hitWallOr() {
        return (
                head_posOr.top < 0 ||
                head_posOr.top > 420 ||
                head_posOr.left < 0 ||
                head_posOr.left > 420
        );
}

function hitBlock() {
	var blocks = $(".block").first();
	while (blocks.length > 0) {
		if (
			blocks.position().left === head_pos.left &&
                        blocks.position().top === head_pos.top
		) {
			console.log("hitBlock");
			return true;
		}
		blocks = blocks.next();
	}
	return false;
}

function hitBlockOr() {
	var blocks = $(".block").first();
	while (blocks.length > 0) {
		if (
			blocks.position().left === head_posOr.left &&
                        blocks.position().top === head_posOr.top
		) {
			console.log("hitBlockOr");
			return true;
		}
		blocks = blocks.next();
	}
	return false;
}

function hitOther() {
	var nodes = $(".snake-node-or").first();
	while (nodes.length !== 0) {
                if (
                        nodes.position().left === head_pos.left &&
                        nodes.position().top === head_pos.top
                ) {
			console.log("hitother");
                        return true;
                }
                nodes = nodes.next().next();
        }
        return false;
}

function hitOtherOr() {
	var nodes = $(".snake-node").first();
	while (nodes.length !== 0) {
                if (
                        nodes.position().left === head_posOr.left &&
                        nodes.position().top === head_posOr.top
                ) {
			console.log("hitother by op");
                        return true;
                }
                nodes = nodes.next().next();
        }
        return false;
}

function hitSelf() {
        var nodes = $(".snake-node").first();
        while (nodes.length !== 0) {
                if (
                        nodes.position().left === head_pos.left &&
                        nodes.position().top === head_pos.top
                ) {
			console.log("hitself");
                        return true;
                }
                nodes = nodes.next().next();
        }
        return false;
}

function hitSelfOr() {
        var nodes = $(".snake-node-or").first();
        while (nodes.length !== 0) {
                if (
                        nodes.position().left === head_posOr.left &&
                        nodes.position().top === head_posOr.top
                ) {
			console.log("hitself by op")
                        return true;
                }
                nodes = nodes.next().next();
        }
        return false;
}

function endgame() {
        //clearTimeout(id);

	var blocks = $(".block").first();
	while (blocks.length > 0) {
		var next = blocks.next();
		blocks.remove();
		blocks = next;
	}

        end = true;
        $("#start").show();
        return;
}
