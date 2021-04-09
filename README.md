# useMembers
React hook for moving callbacks out of a functional component into a separate class

### Before
```typescript
interface IProps {
    prop1: number;
    prop2?: string;
}

export function SomeComponent(props: IProps) {

    const { prop1, prop2 } = props;
    const [value1, setValue1] = React.useState(0);
    const [value2, setValue2] = React.useState("some text");


    const onEvent1 = React.useCallback(() => {
        // ... some code using prop1 and value1 
        // setValue1(evalutedValue)
    }, [prop1, value1]);
    const onEvent2 = React.useCallback((arg: string) => {
        // ... some code using arg, prop1, prop2 and value1 
        // setValue2(evalutedValue)
    }, [prop1, prop2, value2]);

    React.useEffect(() => {
        // some code
    });

    return <AnotherComponent value1={value1} value2={value2} onEvent1={onEvent1} onEvent2={onEvent2}>
        {/* ... some children */}
    </AnotherComponent>;
}
```

### After
```typescript
interface IProps {
    prop1: number;
    prop2?: string;
}

export function SomeComponent(props: IProps) {

    const { prop1, prop2 } = props;
    const [value1, setValue1] = React.useState(0);
    const [value2, setValue2] = React.useState("some text");
    const {onEvent1, onEvent2, afterRender} = useMembers(Members, {props, value1, setValue1, value2, setValue2});
    
    React.useEffect(afterRender);

    return <AnotherComponent value1={value1} value2={value2} onEvent1={onEvent1} onEvent2={onEvent2}>
        {/* ... some children */}
    </AnotherComponent>;
}

interface IDeps {
    props: IProps;
    value1: number;
    setValue1: React.Dispatch<React.SetStateAction<number>>;
    value2: string;
    setValue2: React.Dispatch<React.SetStateAction<string>>;
}

class Members extends MembersBase<IDeps> {
    onEvent1 = () => {
        const {props: {prop1}, value1, setValue1} = this.deps;
        // ... some code using prop1 and value1 
        // setValue1(evalutedValue)
    };
    onEvent2 = (arg: string) => {
        const {props: {prop1, prop2}, value2, setValue2} = this.deps;
        // ... some code using arg, prop1, prop2 and value1 
        // setValue2(evalutedValue)
    };
    afterRender = () => {
        // some code
    };
}
```
