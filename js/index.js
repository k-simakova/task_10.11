const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

let fruitsItem = JSON.parse(fruitsJSON);


/*** ОТОБРАЖЕНИЕ ***/

function display() { 
  if (fruitsList) {
  fruitsList.innerHTML = '';
} 

  for (let i = 0; i < fruitsItem.length; i++) {
    let item = fruitsItem[i];
    let li = document.createElement("li");
    const divElement = document.createElement('div');
    divElement.className = "fruit__info";
    const divIndex = document.createElement ('div');
    const divKind = document.createElement ('div');
    const divColor = document.createElement ('div');
    const divWeight = document.createElement ('div');
    divIndex.innerText = `index: ${i}`;
    divKind.innerText = `kind: ${item.kind}`;
    divColor.innerText = `color: ${item.color}`;
    divWeight.innerText = `weight: ${item.weight}`;


    divElement.appendChild(divIndex);
    divElement.appendChild(divKind);
    divElement.appendChild(divColor);
    divElement.appendChild(divWeight); 

    switch (item.color) {
      case "фиолетовый":
        li.classList.add('fruit_violet');
        break;
      case "зеленый":
        li.classList.add('fruit_green');
        break;
      case "розово-красный":
        li.classList.add('fruit_carmazin');
        break;
      case "желтый":
        li.classList.add('fruit_yellow');
        break;
      case "светло-коричневый":
        li.classList.add('fruit_lightbrown');
        break;
    }

    li.classList.add('fruit__item');
    li.appendChild(divElement);
 
    fruitsList.appendChild(li);
  }
};
display()

/*** ПЕРЕМЕШИВАНИЕ ***/

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleFruits = () => {
  let result = [];

  if (fruitsItem.length <= 1) {
    alert('Массив пустой или содержит только один элемент. Перемешивание не происходит.');
    return;
  }

  while (fruitsItem.length > 0) {
    const randomIndex = getRandomInt(0, fruitsItem.length - 1);
    const randomElement = fruitsItem[randomIndex];
    fruitsItem.splice(randomIndex, 1);
    result.push(randomElement);
  }
 
  fruitsItem = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

const filter = document.querySelector('.line');

filterButton.addEventListener('click', () => {
  const minWeight = parseInt(document.querySelector('.minweight__input').value);
  const maxWeight = parseInt(document.querySelector('.maxweight__input').value);
  const filterFruits = () => {
    fruitsItem = fruitsItem.filter((item) => {
      return item.weight >= minWeight && item.weight <= maxWeight;
    });
  };

  filterFruits();
  display();
});


/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort';
let sortTime = '-';

const comparationColor = (a, b) => {
  if(a.color < b.color) {
    return -1;
  }
  if (a.color > b.color) {
    return 1;
  }
  return 0;
};

function bubbleSortMethod (arr, comparation){
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  };

function quickSortMethod(arr, comparation) {
  if (arr.length <= 1) {
    return arr;
  }
  const pivotIndex = arr.length - 1;
  const pivot = arr[pivotIndex];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (comparation(arr[i], pivot) < 0) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  const sortedArr = [...quickSortMethod(left, comparation), pivot, ...quickSortMethod(right, comparation)];
  return sortedArr;
}

const sortAPI = {
  bubbleSort(arr, comparation) {
    bubbleSortMethod (arr, comparation);
  },

  quickSort(arr, comparation) { 
    const sortedArr = quickSortMethod(arr, comparation);
    fruitsItem = sortedArr;
    console.log(sortedArr); 
    display(sortedArr);
  },

  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    const sortedArr = sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
    display(sortedArr);
  },
};

sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruitsItem, comparationColor);
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const kindInputValue = kindInput.value.trim();
  const colorInputValue = colorInput.value.trim();
  const weightInputValue = weightInput.value.trim();

  if (!kindInputValue || !colorInputValue || !weightInputValue) {
    alert ('Заполните, пожалуйста, все поля');
    return;
  }
  const newFruit = {
    kind: kindInputValue,
    color: colorInputValue,
    weight: weightInputValue,
  };
  
  fruitsItem.push(newFruit);
  
  display();
});
