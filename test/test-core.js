define(['chai'], function(chai) {
    var expect = chai.expect;
    var assert = chai.assert;
    chai.should();
    describe('mutateKey', function() {
        var target = {
            a: "foo",
            b: {
                innerProp1: 1
            },
            c: {
                innerProp1: {
                    mostInnerProp1: 1,
                    mostInnerProp2: 1
                }
            },
            d: function() {
                return {
                    innerProp1: 1
                }
            },
            e: function() {
                return {
                    innerProp1: 1,
                    innerProp2: 2
                }
            },
            f: {
                innerProp1: 1
            },
            g: [1,2],
            h: [1,2]
        };
        var source = {
            'delete.foo' : null,
            'extend.b': {
                innerProp2: 2
            },
            'deepExtend.c': {
                innerProp1: {
                    mostInnerProp1: 3,
                    mostInnerProp2: 2
                }
            },
            'extendFunc.d': {
                innerProp2: 2
            },
            'extendFunc.e': function() {
                return {
                    innerProp2: 3
                }
            },
            'extend.f': function() {
                return {
                    innerProp2: 2
                }
            },
            'push.g': 3,
            'concat.h': [3,4]
        };
        it('should delete key', function() {
            Mutation.mutateKey(target, source, 'a');
            expect(target.foo).to.be.undefined;
        });

        it('should extend key object', function() {
            Mutation.mutateKey(target, source, 'b');
            expect(target.b.innerProp2).to.equal(2);
        });

        it('should extend key function to object', function() {
            Mutation.mutateKey(target, source, 'd');
            expect(target.d().innerProp1).to.equal(1);
            expect(target.d().innerProp2).to.equal(2);
        });

        it('should extend key function to function', function() {
            Mutation.mutateKey(target, source, 'e');
            expect(target.e().innerProp1).to.equal(1);
            expect(target.e().innerProp2).to.equal(3);
        });

        it('should extend key object to function', function() {
            Mutation.mutateKey(target, source, 'f');
            expect(target.f.innerProp2).to.equal(2);
        });

        it('should deep extend key', function() {
            Mutation.mutateKey(target, source, 'c');
            expect(target.c.innerProp1.mostInnerProp1).to.equal(3);
            expect(target.c.innerProp1.mostInnerProp2).to.equal(2);
        });
        it('should concat an array', function() {
            Mutation.mutateKey(target, source, 'h');
            assert.equal(true, _.isEqual(target.h, [1,2,3,4]));
        });
    });

    describe('extendWith', function() {
        describe('delete.', function() {
            var target = {
                a: 1,
                b: "foo",
                c: new Date(),
                d: {
                    "foo": "bar"
                },
                e: null,
                f: undefined,
                g: 2
            };
            var source = {
                'delete.a': null,
                'delete.b': "foo",
                'delete.c': 1,
                'delete.d': {
                    a: 1
                },
                'delete.e': undefined,
                'delete.f': new Date()
            };

            it('should delete key', function() {
                Mutation.extendWith(target, source);
                expect(target.a).to.be.undefined;
                expect(target.b).to.be.undefined;
                expect(target.c).to.be.undefined;
                expect(target.d).to.be.undefined;
                expect(target.e).to.be.undefined;
                expect(target.f).to.be.undefined;
                expect(target.g).to.equal(2);
            });
        });

        describe('replace. / Default Behaviour', function() {
            var  bool = 0;
            var target = {
                b: 2,
                c: {
                    blah: "foo"
                },
                j: {
                    a: 1
                },
                k: "foo",
                l: new Date(1000),
                m: "foo",
                n: 1,
                o: {
                    a: 1
                },
                p: "foo",
                q: 1,
                r: {
                    a: 1
                },
                s: "foo",
                t: undefined,
                u: false
            };
            var source = {
                'b': 3,
                c: "zoo",
                j: {
                    b: 2
                },
                k: "bar",
                l: new Date(2000),
                m: {
                    a: 1
                },
                n: {
                    a: 1
                },
                o: 1,
                p: 1,
                q: "foo",
                r: undefined,
                s: null,
                t: false,
                u: true
            };
            beforeEach(function() {
                Mutation.extendWith(target, source);
            });

            it('should override number > number', function() {
                expect(target.b).to.equal(3);
            });

            it('should override object > object', function() {
                expect(target.j.a).to.be.undefined;
                expect(target.j.b).to.equal(2);
            });

            it('should override string > string', function() {
                expect(target.k).to.equal("bar");
            });

            it('should override date > date', function() {
                expect(target.l.getTime()).to.equal(2000);
            });

            it('should override object > string', function() {
                expect(target.c).to.equal("zoo");
            });

            it('should override string > object', function() {
                expect(target.m.a).to.equal(1);
            });

            it('should override number > object', function() {
                expect(target.n.a).to.equal(1);
            });

            it('should override object > number', function() {
                expect(target.o).to.equal(1);
            });

            it('should override string > number', function() {
                expect(target.p).to.equal(1);
            });

            it('should override number > string', function() {
                expect(target.q).to.equal("foo");
            });

            it('should not override with undefined', function() {
                expect(target.r.a).to.equal(1);
            });

            it('should override with null', function() {
                expect(target.s).to.equal(null);
            });

            it('should support overriding with boolean false', function() {
                expect(target.t).to.equal(false);
            });

            it('should support overriding with boolean true', function() {
                expect(target.u).to.equal(true);
            });
        });

        describe('extend.', function() {
            var target = {
                a: {
                    innerProp1: 1
                },
                b: {
                    innerProp1: 1
                }
            };
            var source = {
                'extend.a': {
                    innerProp2: 2
                },
                'extend.b': function() {
                    return {
                        innerProp2: 2
                    }
                }
            };

            beforeEach(function() {
                Mutation.extendWith(target, source);
            });

            it('extend. should extend object > object', function() {
                expect(target.a.innerProp1).to.equal(1);
                expect(target.a.innerProp2).to.equal(2);
            });

            it('extend. should extend object > function', function() {
                expect(target.b.innerProp1).to.equal(1);
                expect(target.b.innerProp2).to.equal(2);
            });
        });

        describe('deepExtend.', function() {
            var target = {
                'a': {
                    innerProp1: {
                        mostInnerProp3: 3
                    }
                },
                'b': {
                    innerProp1: {
                        mostInnerProp3: 3
                    }
                }
            };
            var source = {
                'deepExtend.a': {
                    innerProp1: {
                        mostInnerProp1: 1,
                        mostInnerProp2: 2
                    }
                },
                'deepExtend.b': function() {
                    return {
                        innerProp1: {
                            mostInnerProp1: 1,
                            mostInnerProp2: 2
                        }
                    }
                }
            };

            beforeEach(function() {
                Mutation.extendWith(target, source);
            });

            it('deepExtend. should deep extend object > object', function() {
                expect(target.a.innerProp1.mostInnerProp1).to.equal(1);
                expect(target.a.innerProp1.mostInnerProp2).to.equal(2);
                expect(target.a.innerProp1.mostInnerProp3).to.equal(3);
            });

            it('deepExtend. should deep extend object > object', function() {
                expect(target.b.innerProp1.mostInnerProp1).to.equal(1);
                expect(target.b.innerProp1.mostInnerProp2).to.equal(2);
                expect(target.b.innerProp1.mostInnerProp3).to.equal(3);
            });
        });
        describe('extendFunc.', function() {
            var target = {
                a: function() {
                    return {
                        innerProp1: 1
                    }
                },
                b: function() {
                    return {
                        innerProp1: 1,
                        innerProp2: 2
                    }
                }
            };
            var source = {
                'extendFunc.a': {
                    innerProp2: 2
                },
                'extendFunc.b': function() {
                    return {
                        innerProp3: 3
                    }
                }
            };

            beforeEach(function() {
                Mutation.extendWith(target, source);
            });

            it('extendFunc. should extend function result from another function', function() {
                expect(target.a().innerProp1).to.equal(1);
                expect(target.a().innerProp2).to.equal(2);
            });

            it('extendFunc. should extend function result from an object', function() {
                expect(target.b().innerProp1).to.equal(1);
                expect(target.b().innerProp2).to.equal(2);
                expect(target.b().innerProp3).to.equal(3);
            });
        });

        describe('deepExtendFunc.', function() {
            var target = {
                a: function() {
                    return {
                        innerProp1: {
                            mostInnerProp1: 1,
                            mostInnerProp2: 2
                        }
                    }
                },
                b: function() {
                    return {
                        innerProp1: {
                            mostInnerProp1: 1,
                            mostInnerProp2: 2
                        }
                    }
                }
            };
            var source = {
                'deepExtendFunc.a': function() {
                    return {
                        innerProp1: {
                            mostInnerProp3: 3
                        }
                    }
                },
                'deepExtendFunc.b': {
                    innerProp1: {
                        mostInnerProp3: 3
                    }
                }
            };

            beforeEach(function() {
                Mutation.extendWith(target, source);
            });

            it('deepExtendFunc. should extend function result from another function', function() {
                expect(target.b().innerProp1.mostInnerProp1).to.equal(1);
                expect(target.b().innerProp1.mostInnerProp2).to.equal(2);
                expect(target.b().innerProp1.mostInnerProp3).to.equal(3);
            });

            it('deepExtendFunc. should extend function result from an object', function() {
                expect(target.b().innerProp1.mostInnerProp1).to.equal(1);
                expect(target.b().innerProp1.mostInnerProp2).to.equal(2);
                expect(target.b().innerProp1.mostInnerProp3).to.equal(3);
            });
        });

        describe('callWith.', function() {
            var target = {
                a: function(arg) {
                    return arg.foo;
                }
            };
            var source = {
                'callWith.a': {
                    foo: "bar"
                }
            };

            beforeEach(function() {
                Mutation.extendWith(target, source);
            });

            it('call. should call original function with new value', function() {
                expect(target.a).to.equal("bar");
            });
        });

        describe('push.', function() {
            var target = {
                a: [1,2]
            };
            var source = {
                'push.a': 3
            };
            Mutation.extendWith(target, source);
            it('should push to array', function() {
                expect(target.a[0]).to.equal(1);
                expect(target.a[1]).to.equal(2);
                expect(target.a[2]).to.equal(3);
                expect(target.a.length).to.equal(3);
            });
        });
        describe('concat.', function() {
            var target = {
                a: [1,2]
            };
            var source = {
                'concat.a': [3,4]
            };
            Mutation.extendWith(target, source);
            it('should concat an array', function() {
                assert.equal(true, _.isEqual(target.a, [1,2,3,4]));
            });
        });
    });

    describe('deepExtendWith', function() {
        var target = {
            a: 1,
            b: 2,
            c: {
                inner1: {
                    foo: "bar",
                    inner2: {
                        foo: "bar"
                    }
                }
            }
        };
        var source= {
            'delete.a': null,
            'b': 3,
            'c': {
                inner1: {
                    baz: "hi",
                    inner2: {
                        'delete.foo': null
                    }
                }
            }
        };

        it('should do the right thing', function() {
            Mutation.deepExtendWith(target, source);

            expect(target.a).to.be.undefined;
            expect(target.b).to.equal(3);
            expect(target.c.inner1.foo).to.equal("bar");
            expect(target.c.inner1.baz).to.equal("hi");
            expect(target.c.inner1.inner2.foo).to.be.undefined;
        });
    });

    describe('should extend a base', function() {
        var a = function() {
        };
        a.prototype = {
            prop1: "some value",
            prop2: "some value",
            prop3: "some value",
            prop4: "some value",
            prop5: "some value",
            prop6: "some value",
        };
        var arrVal = [1,2,3];
        var boolVal = true;
        var objVal = {
            foo: "bar"
        };
        var dateVal = new Date();
        var extendedBase = Mutation.extendBase(a, {
            prop1: 1,
            prop2: "foo",
            prop3: arrVal,
            prop4: dateVal,
            prop5: boolVal,
            prop6: objVal,
            mergeProps: {
                foo: {
                    prop1: 1,
                    prop2: "foo",
                    prop3: arrVal,
                    prop4: dateVal,
                    prop5: boolVal,
                    prop6: objVal
                }
            }
        });
        var inst = new extendedBase();
        it('should extend a base', function() {
            assert.equal(inst.prop1, 1);
            assert.equal(inst.prop2, "foo");
            assert.equal(inst.prop3, arrVal);
            assert.equal(inst.prop4, dateVal);
            assert.equal(inst.prop5, boolVal);
            assert.equal(inst.prop6, objVal);
        })
    });

    describe('deepExtendBase', function() {
        var a = function() {
            this.prop1 = 1;
        };
        a.prototype = {
            prop1: "some value",
            prop2: "some value",
            prop3: "some value",
            prop4: "some value",
            prop5: "some value",
            prop6: "some value",
            mergeProps: {
                foo: {
                    prop1: "some value",
                    prop2: "some value",
                    prop3: "some value",
                    prop4: "some value",
                    prop5: "some value",
                    prop6: "some value"
                }
            }
        };
        var arrVal = [1,2,3];
        var boolVal = true;
        var objVal = {
            foo: "bar"
        };
        var dateVal = new Date();
        var extendedBase = Mutation.deepExtendBase(a, {
            prop1: 1,
            prop2: "foo",
            prop3: arrVal,
            prop4: dateVal,
            prop5: boolVal,
            prop6: objVal,
            mergeProps: {
                foo: {
                    prop1: 1,
                    prop2: "foo",
                    prop3: arrVal,
                    prop4: dateVal,
                    prop5: boolVal,
                    prop6: objVal
                }
            }
        });
        var inst = new extendedBase();
        it('should deep extend a base', function() {
            assert.equal(inst.prop1, 1);
            assert.equal(inst.prop2, "foo");
            assert.equal(inst.prop3, arrVal);
            assert.equal(inst.prop4, dateVal);
            assert.equal(inst.prop5, boolVal);
            assert.equal(inst.prop6, objVal);
            assert.equal(inst.mergeProps.foo.prop1, 1);
            assert.equal(inst.mergeProps.foo.prop2, "foo");
            assert.equal(inst.mergeProps.foo.prop3, arrVal);
            assert.equal(inst.mergeProps.foo.prop4, dateVal);
            assert.equal(inst.mergeProps.foo.prop5, boolVal);
            assert.equal(inst.mergeProps.foo.prop6, objVal);
        })
    });
});
