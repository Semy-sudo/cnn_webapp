let numClass;
let label = [];
let imgAry = [];
const imageSize = 24;
const btnBoard = document.getElementById('btnBoard');
const testBoard = document.getElementById('testBoard');

    function setting() {
        label = [];
        imgAry = [];

        btnBoard.innerHTML = '';
        //numClass = prompt('Number of Class :');
        numClass = 4;
        const className = new Array("Bengal","Boombey","Russianblue","ragdoll");
      
        for (let i = 0; i < numClass; i++) {
            //const className = prompt('Class ' + i + "'s Label :");
            label.push(className[i]);
            console.log(className[i]);
            const btn = document.createElement('button');
            btn.innerText = className[i];



            //각 라벨의 버튼 클릭시 웹브라우저 상에서 데이터 셋 넣기
            btn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = 'multiple';
                //onchange 변화 탐지해줌->디렉터리에서 파일을 불러오는 방식으로 변경
                input.onchange = evt => {
                    console.log(`Added ${evt.target.files.length} ${className[i]} images.`);
                    for (let f of evt.target.files) {
                        const url = URL.createObjectURL(f);//이미지 파일 경로
                        const img = new Image();//이미지 객체의 로드 방식
                        img.id = className[i];//("russianblue","bengal","boombey","ragdoll");
                        img.onload = () => {
                            imgAry.push(img);
                            console.log(imgAry);
                        }
                        img.src = url;
                        console.log(img);
                        console.log(url);
                    }
                }
                input.click();
            });



            if (i % 4 == 0) {
                btnBoard.appendChild(document.createElement('br'));
                btnBoard.appendChild(btn);
            } else {
                btnBoard.appendChild(btn);
            }
        }
    }


    function makeCNN() {
        const model = tf.sequential();
        model.add(tf.layers.conv2d({
            filters: 32,
            kernelSize: 3,
            activation: 'relu',
            inputShape: [imageSize, imageSize, 3],
            strides: 1,
            kernelInitializer: 'varianceScaling'
        }));
        model.add(tf.layers.conv2d({
            filters: 64,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.maxPooling2d({
            poolSize: [2, 2]
        }));
        model.add(tf.layers.flatten());
        model.add(tf.layers.dense({
            units: 128,
            activation: 'relu'
        }));
        model.add(tf.layers.dense({
            units: label.length,
            activation: 'softmax'
        }));
        model.compile({
            loss: 'categoricalCrossentropy',
            optimizer: tf.train.adam(),
            metrics: ['accuracy']
        });
        console.log(model.summary());
        return model;
    }

/*
    function makeCNN() {
        const model = tf.sequential();
        model.add(tf.layers.conv2d({
            filters: 16,
            kernelSize: 3,
            activation: 'relu',
            inputShape: [imageSize, imageSize, 3],
            strides: 1,
            kernelInitializer: 'varianceScaling'
        }));
        model.add(tf.layers.conv2d({
            filters: 32,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.maxPooling2d({
            poolSize: [2, 2]
        }));
        model.add(tf.layers.conv2d({
            filters: 32,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.conv2d({
            filters: 64,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.maxPooling2d({
            poolSize: [2, 2]
        }));
        model.add(tf.layers.conv2d({
            filters: 64,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.conv2d({
            filters: 128,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.maxPooling2d({
            poolSize: [2, 2]
        }));
        model.add(tf.layers.conv2d({
            filters: 128,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.conv2d({
            filters: 256,
            kernelSize: 3,
            activation: 'relu'
        }));
        model.add(tf.layers.maxPooling2d({
            poolSize: [2, 2]
        }));
        model.add(tf.layers.flatten());
        model.add(tf.layers.dense({
            units: 512,
            activation: 'relu'
        }));
        model.add(tf.layers.dense({
            units: label.length,
            activation: 'softmax'
        }));
        model.compile({
            loss: 'categoricalCrossentropy',
            optimizer: tf.train.adam(),
            metrics: ['accuracy']
        });
        console.log(model.summary());
        return model;
    }
*/

    function onBatchEnd(batch, logs) {
        console.log('Loss : %s , Accuracy : %s', logs.loss.toFixed(4), logs.acc.toFixed(4));
    }

    function makeDataset(xs, ys, img) {
        console.log(img)
        return tf.tidy(() => {
            const t = tf.browser.fromPixels(img).resizeNearestNeighbor([imageSize, imageSize]).div(255.0).expandDims();
            
            console.log("t",t);
            (xs == undefined) ? xs = t : xs = xs.concat(t);
            label.forEach((className, index) => {
                if (className == img.id) {
                    console.log("index",index);
                    console.log("label.length",label.length);
                    const l = tf.oneHot(index, label.length).expandDims();
                    console.log("l",l);
                    (ys == undefined) ? ys = l : ys = ys.concat(l);
                }
            });
            console.log(xs);
            console.log(ys);    
            return [xs, ys];
        });
        
    }

    let model;
    async function train() {
        btnBoard.style.display = 'none';
        testBoard.style.display = 'block';
        await console.log('Prepare model...');
        model = await makeCNN();
        await console.log('Model loaded.');
        let xs, ys;
        for (img of imgAry) {
            [xs, ys] = await makeDataset(xs, ys, img);
        }
        console.log(xs)
        console.log(ys)
        console.log(img)
        await console.log('Dataset ready.');
        await model.fit(xs, ys, {
            epochs: 10,
            callbacks: { onBatchEnd }
        });
        await console.log('Done');
    }

    async function predict() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = 'multiple';
        input.onchange = evt => {
            console.log(`Added ${evt.target.files.length} test images.`);
            for (let f of evt.target.files) {
                const url = URL.createObjectURL(f);
                const img = new Image();
                img.onload = async () => {
                    const x = await tf.browser.fromPixels(img).resizeNearestNeighbor([imageSize, imageSize]).div(255.0).expandDims();
                    const predict = await model.predict(x).data();
                    const prob = await Math.max.apply(null, predict);
                    const className = label[predict.indexOf(prob)];
                    console.log('My prediction : %s', className);
                    console.log('Probability : %s', prob.toFixed(4));
                    const d = document.createElement('div');
                    d.innerHTML = `${className} ${prob.toFixed(2) * 100}%`;
                    testBoard.appendChild(img);
                    testBoard.appendChild(d);
                }
                img.src = url;
            }
        }
        input.click();
    }