kaboom({
    backgroundAudio: true,
    scale: 4,
	font: "monospace",
})

const FLOOR_HEIGHT = 20
const JUMP_FORCE = 800
const SPEED = 182

setBackground(141, 183, 255)

loadRoot("assets/")
loadSound("intro", "music/intro.ogg")
loadSound("soundtrack", "music/soundtrack.ogg")
loadSound("final", "music/final.ogg")

const introSound = play("intro", {
    loop: true,
    paused: true
})

const mainSound = play("soundtrack", {
    loop: true,
    paused: true
})

const finalSound = play("final", {
    paused: true
})

loadSpriteAtlas("characters.png", {
    "tom":{
        x:0,
        y:0,
        width: 198, 
        height: 31,
        sliceX: 9,
        anims: {
            jump: { from: 1, to: 4 },
            run: { from: 5, to: 8, loop: true }
        }
    },
    "alien":{
        x:0,
        y:32,
        width: 198,
        height: 31,
        sliceX: 9,
        anims: {
            run: { from: 1, to: 3, loop: true }
        }
    }
})

scene("intro", () => {
    
    introSound.play() 
    
    add([
      text("¡Bienvenido al juego!"),
      pos(center(), height() / 2 - 24),
      {
        value: 0,
      },
    ]);
  
    add([
      text("Presiona 'Espacio' para empezar"),
      pos(center(), height() / 2 + 24),
      {
        value: 0,
      },
    ]);

    onKeyPress("enter", () => {
        go("game");
        finalSound.paused = !finalSound.paused
        introSound.paused = !introSound.paused
      });

  });
  

scene("game", () => {
    finalSound.paused = !finalSound.paused
    mainSound.play()
	setGravity(2400)

	const tom = add([
		sprite("tom", { anim: "run", loop: true }),
		pos(center()),
        anchor("center"),
        area(),
        body() 
	])

	add([
		rect(width(), FLOOR_HEIGHT),
		outline(2),
		pos(0, height()),
		anchor("botleft"),
		area(),
		body({ isStatic: true } ),
		color(132, 101, 236),
	])

	function jump() {
        if (tom.isGrounded()) {
            tom.play("jump")
			tom.jump(JUMP_FORCE)
		}
        wait(0.3, () => {
            tom.play("run");
        });
	}

	onKeyPress("space", jump)
    onClick(jump)

	function alienEnemigo() {

        const enemigo = add([
            sprite("alien", { anim: "run", loop: true }),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            area(), 
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
            "enemigo",
        ]);

		wait(rand(0.5, 1.5), alienEnemigo)

	}

	alienEnemigo()

	tom.onCollide("enemigo", () => {
		go("lose", score)
		mainSound.paused = !mainSound.paused
		addKaboom(tom.pos)
	})

	let score = 0

	const scoreLabel = add([
		text(score),
		pos(24, 24),
	])

	onUpdate(() => {
		score++
		scoreLabel.text = score
	})

})

scene("lose", (score) => {
    
    finalSound.play()
	
    add([
		sprite("tom"),
		pos(width() / 2, height() / 2 - 64),
		scale(2),
		anchor("center"),
	])

	add([
		text(score),
		pos(width() / 2, height() / 2 + 64),
		scale(2),
		anchor("center"),
	])

	onKeyPress("enter", () => go("game"))
    wait(5, () => {
        go("intro")
    });

})

go("intro")