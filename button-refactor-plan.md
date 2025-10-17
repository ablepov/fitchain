# План переделки логики кнопок добавления подходов

## Обзор изменений

**Текущая логика:** Немедленное добавление подхода при нажатии кнопки
**Новая логика:** Буферный механизм с задержкой 5 секунд для корректировки значения

## Цели переделки

1. **Улучшить UX** - возможность корректировки значения до фиксации
2. **Предотвратить случайные клики** - буфер дает время на отмену
3. **Упростить ввод** - комбинирование нескольких кнопок для точного значения
4. **Сохранить производительность** - минимизировать API запросы

## Функциональные требования

### Буферный механизм
- Нажатие кнопки не сразу отправляет запрос в API
- Формируется буферное значение с таймером 5 секунд
- Каждое нажатие перезапускает таймер
- По истечении таймера буферное значение фиксируется как подход

### Поведение кнопок
- **Существующие кнопки:** `+3`, `+5`, `+8` (адаптивные), `+1`
- **Кнопка `-1`:** для уменьшения буферного значения
- **Все кнопки активны** во время работы буфера

### Примеры сценариев
```
Сценарий 1: Простое добавление
+5 → буфер: 5, таймер: 5 сек → фиксация подхода +5

Сценарий 2: Корректировка
+3 → буфер: 3, таймер: 5 сек
+3 → буфер: 6, таймер: 5 сек (перезапуск)
-1 → буфер: 5, таймер: 5 сек (перезапуск)
→ фиксация подхода +5

Сценарий 3: Множественные корректировки
+8 → буфер: 8
+1 → буфер: 9
-1 → буфер: 8
+5 → буфер: 13
→ фиксация подхода +13
```

## Архитектура решения

### Детальная архитектура буферного механизма

#### Стейт-машина буферного режима

```
┌─────────────┐    +N/-1     ┌─────────────┐
│   Обычный   │ ───────────► │   Буферный  │
│    режим    │   кнопка     │    режим    │
└─────────────┘              └─────────────┘
      ▲                              │
      │                              ▼
      │                       ┌─────────────┐
      │         5 секунд      │  Фиксация   │
      └───────────────────────│  подхода    │
                               └─────────────┘
```

#### Управление состоянием буфера

```typescript
interface BufferState {
  value: number;           // Текущее буферное значение
  isActive: boolean;       // Буфер активен
  timeLeft: number;        // Остаток времени в секундах
  timerId: NodeJS.Timeout | null;  // ID активного таймера
  startTime: number;       // Время начала буфера (для телеметрии)
}

// Возможные действия с буфером
type BufferAction =
  | { type: 'START'; payload: number }       // Начать буфер с начальным значением
  | { type: 'ADD'; payload: number }         // Добавить к буферу
  | { type: 'RESET' }                        // Сбросить буфер
  | { type: 'TICK'; payload: number }        // Обновить таймер
  | { type: 'COMMIT' }                       // Зафиксировать подход
  | { type: 'CANCEL' }                       // Отменить буфер (кнопка ×)
```

#### Детальная логика функций буфера

```typescript
// Редуктор для управления состоянием буфера
function bufferReducer(state: BufferState, action: BufferAction): BufferState {
  switch (action.type) {
    case 'START':
      return {
        value: action.payload,
        isActive: true,
        timeLeft: 5,
        timerId: setTimeout(() => commitBuffer(), 5000),
        startTime: Date.now()
      };

    case 'ADD':
      // Перезапуск таймера при каждом добавлении
      if (state.timerId) clearTimeout(state.timerId);
      return {
        ...state,
        value: state.value + action.payload,
        timeLeft: 5,
        timerId: setTimeout(() => commitBuffer(), 5000)
      };

    case 'RESET':
      if (state.timerId) clearTimeout(state.timerId);
      return {
        value: 0,
        isActive: false,
        timeLeft: 0,
        timerId: null,
        startTime: 0
      };

    case 'TICK':
      return {
        ...state,
        timeLeft: Math.max(0, action.payload)
      };

    case 'COMMIT':
      // Отправка в API и сброс буфера
      await sendToAPI(state.value);
      return bufferReducer(state, { type: 'RESET' });

    case 'CANCEL':
      // Принудительная отмена буфера без отправки в API
      if (state.timerId) clearTimeout(state.timerId);
      return {
        value: 0,
        isActive: false,
        timeLeft: 0,
        timerId: null,
        startTime: 0
      };

    default:
      return state;
  }
}
```

#### Интеграция с существующей логикой

**Сохранение обратной совместимости:**
```typescript
// Интерфейс компонента остается неизменным
export function QuickButtons({
  exerciseId,
  onAdded,
  todayTotal = 0
}: {
  exerciseId: string;
  onAdded?: () => void;
  todayTotal?: number
}) {
  // Внутренняя буферная логика инкапсулирована
  const [bufferState, dispatch] = useReducer(bufferReducer, initialBufferState);
}
```

#### Валидация буферных значений

```typescript
const BUFFER_LIMITS = {
  MIN: -100,
  MAX: 100,
  TIMER_SECONDS: 5
};

function validateBufferValue(value: number): boolean {
  return value >= BUFFER_LIMITS.MIN && value <= BUFFER_LIMITS.MAX;
}

function addToBuffer(amount: number) {
  const newValue = bufferState.value + amount;
  if (!validateBufferValue(newValue)) {
    setMessage(`Значение должно быть от ${BUFFER_LIMITS.MIN} до ${BUFFER_LIMITS.MAX}`);
    return;
  }
  dispatch({ type: 'ADD', payload: amount });
}
```

### Визуальные индикаторы буферного режима

#### Детальные визуальные индикаторы буферного режима

**1. Индикатор буферного значения**
```typescript
// Промinent отображение текущего буферного значения
<div className="text-2xl font-bold text-orange-600 animate-pulse">
  {bufferState.value > 0 ? '+' : ''}{bufferState.value}
</div>
```

**2. Circular Progress Bar с буферным значением**
```typescript
// Кольцевой прогресс-бар с центральным значением
<div className="relative">
  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
    {/* Фон кольца */}
    <path
      d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831"
      fill="none"
      stroke="#f3f4f6"
      strokeWidth="2"
    />
    {/* Прогресс кольца */}
    <path
      d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831"
      fill="none"
      stroke="#f97316"
      strokeWidth="2"
      strokeDasharray={`${(timeLeft / 5) * 100}, 100`}
      className="transition-all duration-1000 ease-linear"
    />
  </svg>
  {/* Центральное значение */}
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-lg font-bold text-orange-600">
      {bufferState.value}
    </span>
  </div>
</div>
```

**3. Изменение внешнего вида кнопок в буферном режиме**
```typescript
// Все кнопки получают оранжевый акцент
const buttonClass = isBuffering
  ? "border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100"
  : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100";
```

**4. Комплексный буферный интерфейс**

**Обычный режим:**
```
┌─────────────────────────────────────────┐
│  [-1]  [+3]  [+5]  [+8]  [+1]         │ ← Стандартные кнопки
└─────────────────────────────────────────┘
```

**Буферный режим:**
```
┌─────────────────────────────────────────┐
│  [-1]  [+3]  [+5]  [+8]  [+1]         │ ← Активные кнопки с оранжевым акцентом
├─────────────────────────────────────────┤
│    +7 × | [●●●●●○○○○○]    │ ← Буфер + крестик отмены + кольцевой прогресс
└─────────────────────────────────────────┘
```

**5. Анимации и переходы**

```typescript
// Плавный переход между режимами
<div className={`transition-all duration-300 ${
  isBuffering
    ? 'border-orange-200 bg-orange-50/30'
    : 'border-gray-200 bg-white'
}`}>
  {/* Контент кнопок */}
</div>

// Анимация появления буферного индикатора
<div className={`transition-all duration-500 ${
  isBuffering
    ? 'opacity-100 max-h-20 scale-100'
    : 'opacity-0 max-h-0 scale-95'
} overflow-hidden`}>
  {/* Индикатор буфера */}
</div>
```

**6. Специальные состояния кнопок**

```typescript
// Кнопка -1 в буферном режиме
<button
  className={`${
    bufferState.value <= -100
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:bg-red-100'
  }`}
  disabled={bufferState.value <= -100}
  title={bufferState.value <= -100 ? "Минимальное значение буфера" : undefined}
>
  -1
</button>

// Индикатор достижения лимита
{bufferState.value >= 100 && (
  <div className="text-xs text-amber-600 font-medium">
    Максимальное значение буфера
  </div>
)}
```

**7. Кнопка отмены буфера**

```typescript
// Комплексный буферный интерфейс с отменой
<div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
  {/* Буферное значение */}
  <div className="text-xl font-bold text-orange-600">
    +{bufferState.value}
  </div>

  {/* Кнопка отмены */}
  <button
    onClick={() => dispatch({ type: 'CANCEL' })}
    className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 hover:bg-orange-300 flex items-center justify-center text-sm font-bold transition-colors"
    aria-label="Отменить буфер"
    title="Отменить добавление подхода"
  >
    ×
  </button>

  {/* Circular Progress Bar */}
  <div className="relative">
    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#fed7aa"
        strokeWidth="2"
      />
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#ea580c"
        strokeWidth="2"
        strokeDasharray={`${(bufferState.timeLeft / 5) * 100}, 100`}
        className="transition-all duration-1000 ease-linear"
      />
    </svg>
  </div>
</div>
```

**8. Обновленная валидация граничных значений**

```typescript
const BUFFER_LIMITS = {
  MIN: 0,        // Изменено с -100 на 0
  MAX: 100,
  TIMER_SECONDS: 5
};

function validateBufferValue(value: number): boolean {
  return value >= BUFFER_LIMITS.MIN && value <= BUFFER_LIMITS.MAX;
}

// Кнопка -1 активна только если буфер > 0
<button
  className={`${
    bufferState.value <= 0
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:bg-red-100'
  }`}
  disabled={bufferState.value <= 0}
  title={bufferState.value <= 0 ? "Минимальное значение буфера" : undefined}
>
  -1
</button>
```

**9. Подготовка архитектуры для звуков (будущая функциональность)**

```typescript
// Интерфейс для звуковых уведомлений
interface SoundConfig {
  bufferStart?: string;
  bufferCancel?: string;
  approachCommitted?: string;
  enabled: boolean;
}

// Хук для управления звуками
function useBufferSounds(config: SoundConfig) {
  const playSound = useCallback((soundType: keyof SoundConfig) => {
    if (!config.enabled || !config[soundType]) return;

    const audio = new Audio(config[soundType]);
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Игнорируем ошибки автозапуска
  }, [config]);

  return { playSound };
}
```

## Детальные изменения в компонентах

### Компонент QuickButtons - полная переработка

#### Структура нового компонента

```typescript
export function QuickButtons({ exerciseId, onAdded, todayTotal = 0 }) {
  // Старая логика (оставляем для fallback)
  const [lastReps, setLastReps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Новая буферная логика
  const [bufferState, dispatch] = useReducer(bufferReducer, {
    value: 0,
    isActive: false,
    timeLeft: 0,
    timerId: null,
    startTime: 0
  });

  // UI состояние
  const [message, setMessage] = useState<string | null>(null);
  const [justCommitted, setJustCommitted] = useState<number | null>(null);

  // Эффекты для управления таймером
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (bufferState.isActive) {
      intervalId = setInterval(() => {
        const elapsed = (Date.now() - bufferState.startTime) / 1000;
        const remaining = Math.max(0, 5 - elapsed);

        if (remaining <= 0) {
          dispatch({ type: 'COMMIT' });
        } else {
          dispatch({ type: 'TICK', payload: remaining });
        }
      }, 100); // Обновление каждые 100мс для плавности
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [bufferState.isActive, bufferState.startTime]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (bufferState.timerId) {
        clearTimeout(bufferState.timerId);
      }
    };
  }, []);
}
```

#### Интеграция с существующей логикой расчета кнопок

```typescript
// Адаптивные кнопки рассчитываются как раньше
const buttons = useMemo(() => {
  const m = median(lastReps);
  if (!m) return [3, 5, 8];
  return [m - 2, m, m + 2].map((v) => Math.max(1, v));
}, [lastReps]);

// Обработчик нажатия кнопки - запускает буфер
function handleButtonClick(amount: number) {
  if (bufferState.isActive) {
    // Добавляем к существующему буферу
    dispatch({ type: 'ADD', payload: amount });
  } else {
    // Начинаем новый буфер
    dispatch({ type: 'START', payload: amount });
  }
  setMessage(null); // Сбрасываем сообщения об ошибках
}
```

### API и внешние зависимости

#### Минимальные изменения в API
- **Запросы отправляются с тем же форматом** - никаких изменений не требуется
- **Телеметрия** отправляется при фиксации буфера, а не при клике

#### Обновленная функция отправки подхода
```typescript
async function commitBuffer() {
  const value = bufferState.value;

  // Отправляем телеметрию с информацией о буфере
  await fetch('/api/telemetry', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      event: 'buffer_commit',
      exerciseId,
      reps: value,
      bufferDuration: (Date.now() - bufferState.startTime) / 1000
    })
  }).catch(() => {});

  // Создаем подход как раньше
  const res = await fetch('/api/sets', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      exerciseId,
      reps: value,
      source: 'quickbutton'
    })
  });

  if (res.ok) {
    // Обновляем локальную историю
    setLastReps(prev => [value, ...prev].slice(0, 20));

    // Показываем подтверждение
    setJustCommitted(value);
    setTimeout(() => setJustCommitted(null), 2000);

    // Уведомляем родителя
    if (onAdded) onAdded();
  }
}
```

### Компонент page.tsx - минимальные изменения

```typescript
// Интерфейс остается полностью неизменным
<QuickButtons
  exerciseId={e.id}
  onAdded={() => setRefreshTrigger(prev => prev + 1)}
  todayTotal={todayTotals[e.type] || 0}
/>

// Единственное изменение - возможно, добавить обработчик
// для новых событий буферного режима (опционально)
onBufferStateChange?: (isActive: boolean, value: number) => void
```

### Компонент SummaryPanel - без изменений

- Продолжает работать с теми же данными из БД
- Обновление происходит при фиксации буфера через существующие механизмы
- WebSocket соединение ловит изменения как раньше

### Компонент MiniChart - без изменений

- Данные для графика загружаются из API как раньше
- Обновление происходит при фиксации подхода

## План разработки (итерации)

### Итерация 1: Прототип буферного механизма
- [ ] Реализовать базовую логику буфера в QuickButtons
- [ ] Добавить визуальные индикаторы (таймер, буферное значение)
- [ ] Тестирование базового функционала (добавление/сброс)

### Итерация 2: UX полировка
- [ ] Настроить цветовую схему буферного режима
- [ ] Добавить анимации и переходы
- [ ] Оптимизировать расположение элементов

### Итерация 3: Корнер-кейсы и валидация
- [ ] Обработка быстрых кликов
- [ ] Валидация граничных значений буфера
- [ ] Обработка ошибок сети во время буфера

### Итерация 4: Тестирование и отладка
- [ ] Unit тесты для буферной логики
- [ ] Интеграционные тесты с API
- [ ] UX тестирование сценариев использования

## Критерии приемки

### Функциональные критерии
- [ ] Буфер активируется при нажатии любой кнопки (+N или -1)
- [ ] Таймер корректно перезапускается при повторных нажатиях
- [ ] Буферное значение правильно рассчитывается при последовательных нажатиях
- [ ] По истечении таймера подход фиксируется в БД
- [ ] Кнопки активны только во время буфера

### UX критерии
- [ ] Пользователь явно видит буферное значение
- [ ] Таймер обратного отсчета видим и понятен
- [ ] Визуальное отличие буферного режима от обычного
- [ ] Гладкие анимации без лагов

### Производительность
- [ ] Не более одного активного таймера одновременно
- [ ] Буфер сбрасывается при размонтировании компонента
- [ ] Memory leaks отсутствуют при длительном использовании

## План тестирования новой функциональности

### Этапы тестирования

#### Этап 1: Unit-тестирование буферной логики
```typescript
// Тесты для буферного редюсера
describe('Buffer Reducer', () => {
  test('должен правильно инициализировать буфер', () => {
    const result = bufferReducer(initialState, { type: 'START', payload: 5 });
    expect(result.value).toBe(5);
    expect(result.isActive).toBe(true);
    expect(result.timeLeft).toBe(5);
  });

  test('должен перезапускать таймер при добавлении', () => {
    const state = bufferReducer(initialState, { type: 'START', payload: 3 });
    const result = bufferReducer(state, { type: 'ADD', payload: 2 });
    expect(result.value).toBe(5);
    expect(result.timeLeft).toBe(5); // Перезапуск таймера
  });

  test('должен валидировать граничные значения', () => {
    const state = { ...initialState, value: 99, isActive: true };
    const result = bufferReducer(state, { type: 'ADD', payload: 2 });
    expect(result.value).toBe(100); // Должен позволить +100
  });
});
```

#### Этап 2: Интеграционное тестирование компонента
```typescript
describe('QuickButtons Integration', () => {
  test('должен показывать буферный режим после клика', async () => {
    render(<QuickButtons exerciseId="test-id" />);

    fireEvent.click(screen.getByLabelText('Добавить 5'));

    expect(screen.getByText('+5')).toBeInTheDocument();
    expect(screen.getByText(/4\.\dс/)).toBeInTheDocument();
  });

  test('должен фиксировать подход по истечении таймера', async () => {
    jest.useFakeTimers();
    render(<QuickButtons exerciseId="test-id" />);

    fireEvent.click(screen.getByLabelText('Добавить 3'));

    // Перематываем время на 5 секунд
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledWith(
        expect.objectContaining({ reps: 3 })
      );
    });
  });

  test('должен отменять буфер при нажатии крестика', async () => {
    render(<QuickButtons exerciseId="test-id" />);

    // Начинаем буфер
    fireEvent.click(screen.getByLabelText('Добавить 5'));
    expect(screen.getByText('+5')).toBeInTheDocument();

    // Отменяем буфер
    fireEvent.click(screen.getByLabelText('Отменить буфер'));

    // Буфер должен исчезнуть
    await waitFor(() => {
      expect(screen.queryByText('+5')).not.toBeInTheDocument();
      expect(mockApiCall).not.toHaveBeenCalled();
    });
  });
});
```

#### Этап 3: E2E тестирование пользовательских сценариев

**Сценарий 1: Простое добавление подхода**
```
Given: Пользователь на странице упражнений
When: Нажимает кнопку +5
Then: Появляется буфер с значением +5 и таймером 5 секунд
And: Через 5 секунд подход +5 фиксируется в БД
```

**Сценарий 2: Корректировка значения**
```
Given: Буфер активен со значением +3, таймер 3 секунды
When: Пользователь нажимает +5
Then: Буферное значение становится +8
And: Таймер перезапускается на 5 секунд
```

**Сценарий 3: Достижение граничного значения**
```
Given: Буфер активен со значением +99
When: Пользователь нажимает +1
Then: Буферное значение становится +100
And: Кнопка +1 становится неактивной

Сценарий 3.1: Попытка сделать отрицательным
Given: Буфер активен со значением 0
When: Пользователь нажимает -1
Then: Буфер остается 0
And: Кнопка -1 заблокирована
```

**Сценарий 4: Отмена буфера**
```
Given: Буфер активен со значением +7, таймер 3 секунды
When: Пользователь нажимает кнопку × (отмена)
Then: Буфер исчезает немедленно
And: Подход не фиксируется в БД
And: Возврат к обычному режиму кнопок
```

**Сценарий 4: Навигация во время буфера**
```
Given: Буфер активен со значением +7, таймер 2 секунды
When: Пользователь уходит со страницы
Then: Буфер автоматически сбрасывается
And: Подход не фиксируется
```

#### Этап 4: UX тестирование

**Тесты визуальных индикаторов:**
- [ ] Буферное значение четко видно и выделено
- [ ] Таймер обратного отсчета плавно уменьшается
- [ ] Прогресс-бар корректно заполняется
- [ ] Кнопки изменяют цвет в буферном режиме
- [ ] Анимации плавные и не вызывают лагов

**Тесты производительности:**
- [ ] Время отклика на клик < 100мс
- [ ] Плавность анимации таймера (60fps)
- [ ] Отсутствие memory leaks при длительном использовании
- [ ] Корректная работа на мобильных устройствах

#### Этап 5: Нагрузочное тестирование

**Тесты стабильности:**
- [ ] 100 последовательных кликов за короткое время
- [ ] Множественные буферы на разных упражнениях одновременно
- [ ] Длительная работа с активными таймерами (1 час)

### Метрики качества

#### Функциональные метрики
- **Coverage:** > 90% покрытие кода тестами
- **Ошибки:** 0 critical/high severity багов
- **Производительность:** Время отклика < 100мс

#### UX метрики
- **Целевые показатели:**
  - Время обучения новой функциональности < 2 минуты
  - Количество ошибок пользователя < 5% от общего использования
  - Удовлетворенность пользователей > 4.5/5

### Инструменты тестирования

#### Автоматизированные тесты
- **Jest + React Testing Library** - unit и интеграционные тесты
- **Playwright** - E2E тесты пользовательских сценариев
- **Lighthouse** - performance и accessibility аудиты

#### Ручное тестирование
- **User testing** - проверка UX с реальными пользователями
- **Cross-browser testing** - Safari, Chrome, Firefox, Edge
- **Mobile testing** - iOS Safari, Android Chrome

### Регрессионное тестирование

**Проверка существующей функциональности:**
- [ ] Загрузка истории подходов работает корректно
- [ ] Адаптивные кнопки рассчитываются правильно
- [ ] API запросы отправляются в правильном формате
- [ ] Обновление SummaryPanel происходит timely
- [ ] WebSocket соединения работают стабильно

### План rollout

#### Этап 1: Alpha тестирование (локальная среда)
- Разработка и тестирование в development среде
- Code review и security audit
- Фикс выявленных багов

#### Этап 2: Beta тестирование (ограниченная группа пользователей)
- Развертывание на staging среде
- Тестирование с небольшой группой пользователей
- Сбор feedback и финальные корректировки

#### Этап 3: Production rollout
- Постепенное развертывание (canary release)
- Мониторинг ошибок и производительности
- Готовность к rollback при необходимости

## Риски и mitigation

### Риск: Пользователь запутается в буферном режиме
**Mitigation:** Четкие визуальные индикаторы + туториал + плавный onboarding

### Риск: Слишком много кликов за 5 секунд
**Mitigation:** Валидация граничных значений (-100 до 100) + визуальные предупреждения

### Риск: Пользователь уйдет со страницы во время буфера
**Mitigation:** Буфер сбрасывается при unmount + автосохранение черновика

### Риск: Производительность на слабых устройствах
**Mitigation:** Оптимизация анимаций + throttling для тяжелых операций

### Риск: Конфликты с существующими таймерами
**Mitigation:** Уникальные идентификаторы таймеров + cleanup при unmount

## Уточненные требования (от пользователя)

### ✅ Одобренные решения:

1. **Таймер:** Показывать Circular Progress Bar с буферным значением внутри, без цифрового значения задержки
   - Визуал: кольцевой прогресс-бар с цифрой в центре
   - Поведение: кольцо уменьшается по мере истечения времени
   - Исчезает при фиксации подхода

2. **Отмена буфера:** Да, нужна кнопка крестик рядом с буферным значением
   - Расположение: справа от буферного значения
   - Функция: принудительная отмена буфера без фиксации подхода
   - Визуал: небольшой крестик (×) с hover эффектом

3. **Граничные значения:** Буферное значение не может быть отрицательным
   - Минимум: 0 (ноль)
   - Максимум: 100 (оставляем как есть)
   - Валидация: кнопка -1 недоступна если буфер <= 0
   - **Важно:** Если буфер = 0 и таймер истек → подход НЕ добавляется

4. **Звуковые индикаторы:** Не нужны в текущей версии, но заложить архитектуру
   - Подготовить: интерфейс для будущего добавления звуков
   - Метрики: отслеживать события фиксации для аналитики

---

*Документ будет обновляться по мере уточнения деталей и принятия решений*