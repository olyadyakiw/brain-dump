import { useState } from 'react'
import Logo from './Logo.jsx'
import Form from './Form.jsx'
import PackingList from './PackingList.jsx'
import Stats from './Stats.jsx'

export default function App() {
    const [items, setItems] = useState([])

    function handleAddItems(item) {
        setItems(items => [...items, item])
    }

    function handleDeleteItem(id) {
        setItems(items => items.filter(item => item.id !== id))
    }

    function handleToggleItem(id) {
        setItems(items.map(item => (item.id === id ? { ...item, packed: !item.packed } : item)))
    }

    function handleResetList() {
        const confirmed = window.confirm('Are you sure you want to delete all items?')
        confirmed && setItems([])
    }

    return (
        <div className="app">
            <Logo />
            <Form onAddItems={handleAddItems} />
            <PackingList
                onResetList={handleResetList}
                onDeleteItem={handleDeleteItem}
                onToogleItem={handleToggleItem}
                items={items}
            />
            <Stats items={items} />
        </div>
    )
}
