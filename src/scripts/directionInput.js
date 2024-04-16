export default class DirectionalInput {
    constructor(initialSelectedElement) {
        this.select(initialSelectedElement);
        this.selectableElements = [];

        this.updateQuery();
        document.addEventListener('keydown', this.handleKeyDown);

        this.backup = null;
    }
    isVisible = (element) => {
        function isElementHidden(element) {
            var computedStyle = window.getComputedStyle(element);

            if (computedStyle.display === 'none') {
                return true;
            }

            var parent = element.parentElement;
            while (parent) {
                if (window.getComputedStyle(parent).display === 'none') {
                    return true;
                }
                parent = parent.parentElement;
            }
            return false;
        }
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.visibility !== 'hidden' && !isElementHidden(element) && computedStyle.pointerEvents != 'none';
    }

    backupCurrentState = function () {
        if (this.backup != null) return;
        this.backup = {};
        this.backup.selectableElements = this.selectableElements;
        this.backup.selected = this.selected;
    }

    updateQuery = function () {
        const query = document.getElementsByTagName('button');
        this.selectableElements = [];

        for (let i = 0; i < query.length; i++) {
            const element = query[i];
            if (this.isVisible(element)) {
                this.selectableElements.push({ element: element });
            }
        }
    }

    updateQueryCustom = function (elements, selectedElement) {
        this.select(selectedElement);
        this.selectableElements = elements;
    }

    select = function (element) {
        if (this.selected != null) {
            this.selected.element.classList.remove('selected');
        }

        this.selected = element;
        this.selected.element.classList.add('selected');
        this.selected.onSelect?.();
    }

    findClosestToDirection = function (direction) {
        const visibleCheck = this.isVisible;

        function isObjectInDirection(object, startPosition, direction) {
            const offsetPosition = { x: startPosition.x + direction.x * 10, y: startPosition.y - direction.y * 10 }

            const vectorToObject = { x: object.x - offsetPosition.x, y: object.y - offsetPosition.y };
            return vectorToObject.x * direction.x >= 0 && vectorToObject.y * direction.y <= 0;
        }

        function distance(point1, point2) {
            return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
        }

        function findNearestObject(startPosition, objects) {
            let nearestObject = null;
            let minDistance = Infinity;

            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                if (visibleCheck(object.selectable.element)) {
                    const dist = distance(startPosition, object.position);
                    if (dist < minDistance) {
                        minDistance = dist;
                        nearestObject = object;
                    }
                }
            }

            return nearestObject;
        }

        const data = [];

        for (let i = 0; i < this.selectableElements.length; i++) {
            const selectable = this.selectableElements[i];
            if (selectable.element == this.selected.element) continue;

            const box = selectable.element.getBoundingClientRect();
            const position = { x: box.left + box.width / 2 - direction.x * box.width * .1, y: box.top + box.height / 2 - direction.y * box.height * .1 };
            data.push({ selectable: selectable, position: position });
        }
        const selectedElementBox = this.selected.element.getBoundingClientRect();

        const offset = { x: 0, y: 0 };

        if (direction.x > 0) {
            offset.x = selectedElementBox.width;
            offset.y = selectedElementBox.height / 2;
        } else if (direction.x < 0) {
            offset.x = 0;
            offset.y = selectedElementBox.height / 2;
        } else if (direction.y > 0) {
            offset.x = selectedElementBox.width / 2 - 1;
            offset.y = 0;
        } else if (direction.y < 0) {
            offset.x = selectedElementBox.width / 2 - 1;
            offset.y = selectedElementBox.height;
        }

        const selectedPosition = { x: selectedElementBox.left + offset.x, y: selectedElementBox.top + offset.y };

        const directionedElements = [];

        for (let i = 0; i < data.length; i++) {
            const unit = data[i];
            if (isObjectInDirection(unit.position, selectedPosition, direction)) {
                directionedElements.push(unit);
            }
        }

        const nearest = findNearestObject(selectedPosition, directionedElements);
        if (nearest != null) {
            this.select(nearest.selectable);
        }
    }

    handleKeyDown = (event) => {

        let direction = { x: 0, y: 0 };
        switch (event.key) {
            case "ArrowLeft":
                direction = { x: -1, y: 0 };
                break;
            case "ArrowRight":
                direction = { x: 1, y: 0 };
                break;
            case "ArrowUp":
                direction = { x: 0, y: 1 };
                break;
            case "ArrowDown":
                direction = { x: 0, y: -1 };
                break;
            case "Enter":
                if (this.selected.element != null) {
                    this.selected.element.click();
                    this.selected.onSubmit?.();
                }
                break;
            case "Escape":
                if (this.selected.element != null) {
                    this.selected.onBack?.();
                }
                break;
        }

        if (direction.x == 0 && direction.y == 0) return;

        this.findClosestToDirection(direction);
    }
}