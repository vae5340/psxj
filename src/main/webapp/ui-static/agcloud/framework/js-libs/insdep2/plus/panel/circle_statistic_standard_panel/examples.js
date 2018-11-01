$(document).ready(function() {

    var g1, g2, g3, g4;

    var g1 = new JustGage({
        id: "examples_circle_statistic_a",
        value: getRandomInt(0, 500),
        min: 0,
        max: 500,
        title: "登录",
        label: "",
        relativeGaugeSize: true,
        donut: true
    });

    var g2 = new JustGage({
        id: "examples_circle_statistic_b",
        value: getRandomInt(0, 255),
        min: 0,
        max: 255,
        title: "积分",
        label: "",
        relativeGaugeSize: true,
        donut: true
    });

    var g3 = new JustGage({
        id: "examples_circle_statistic_c",
        value: getRandomInt(0, 128),
        min: 0,
        max: 128,
        title: "余额",
        label: "元",
        relativeGaugeSize: true,
        donut: true
    });

    var g4 = new JustGage({
        id: "examples_circle_statistic_d",
        value: getRandomInt(0, 1000),
        min: 0,
        max: 1000,
        title: "累计里程",
        label: "km",
        relativeGaugeSize: true,
        donut: true
    });

	setInterval(function() {
      g1.refresh(getRandomInt(50, 500));
      g2.refresh(getRandomInt(0, 255));
      g3.refresh(getRandomInt(0, 128));
      g4.refresh(getRandomInt(255, 1000));
    }, 1500);
    
});