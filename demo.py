ListData = [[1, 2], [3, 4], [5, 6], 7]
ListStore = []
for a in ListData:
    if isinstance(a, list):
        for b in a:
            ListStore.append(b)
    else:
        ListStore.append(a)

print(ListStore)


class name():
    pass


def name1():
    pass


asd = lambda x: x


class A:
    pass


def qwe():
    data = 0

    def asd():
        pass

    return asd()


# lista = [1,2,34,4]
liostasd = iter([a for a in range(10)])
print(liostasd)


try:
    pass
except:
    pass
