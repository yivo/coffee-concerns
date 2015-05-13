describe 'Included concerns', ->

  it 'should be set correctly', ->
    ConcernFoo = {}
    ConcernBar = {}
    ConcernBaz = {}

    class Foo
      @include ConcernFoo
      @include ConcernBaz

    class Bar extends Foo
      @include ConcernBaz
      @include ConcernBar

    class Baz
      @include ConcernBar
      @include ConcernBaz

    expect(Foo.concerns).toEqual [ConcernFoo, ConcernBaz]
    expect(Bar.concerns).toEqual [ConcernFoo, ConcernBaz, ConcernBar]
    expect(Baz.concerns).toEqual [ConcernBar, ConcernBaz]