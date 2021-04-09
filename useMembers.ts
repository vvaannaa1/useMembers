import {useRef} from "react";

export class MembersBase<T> {
    protected deps: T;
    setDeps(d: T) {
        this.deps = d;
        this.afterSetDeps();
    }
    /**
     * for overriding in descendants
     */
    protected afterSetDeps() {}
}

export function useMembers<D, T extends MembersBase<D>>(ctor: (new () => T), deps:  (T extends MembersBase<infer D> ? D : never)): T {
    const ref = useRef<T>();
    if (!ref.current) {
        ref.current = new ctor();
    }
    const rv = ref.current;
    rv.setDeps(deps);
    return rv;
}
