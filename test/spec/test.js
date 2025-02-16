"use strict";

import bigList from "./utils/bigList.json";

import {clearDom, createDomElement, fillIn, simulateMouseClick, simulateElementScroll} from './utils/dom-helpers';

import { attachTribute, detachTribute } from "./utils/tribute-helpers";

describe("Tribute instantiation", function() {
  it("should not error in the base case from the README", () => {
    const options = [
      { key: "Phil Heartman", value: "pheartman" },
      { key: "Gordon Ramsey", value: "gramsey" }
    ];
    const tribute = new Tribute({
      values: options
    });

    expect(tribute.collection[0].values).toEqual(options);
  });
});

describe("Tribute @mentions cases", function() {
  afterEach(function() {
    clearDom();
  });

  ["text", "contenteditable"].forEach(elementType => {
    ["@", "$("].forEach(trigger => {
      it(`when values key is predefined array. For : ${elementType} / ${trigger}`, () => {
        let input = createDomElement(elementType);

        let collectionObject = {
          trigger: trigger,
          selectTemplate: function(item) {
            if (typeof item === "undefined") return null;
            if (this.range.isContentEditable(this.current.element)) {
              return (
                '<span contenteditable="false"><a href="http://zurb.com" target="_blank" title="' +
                item.original.email +
                '">' +
                item.original.value +
                "</a></span>"
              );
            }

            return trigger + item.original.value;
          },
          values: [
            {
              key: "Jordan Humphreys",
              value: "Jordan Humphreys",
              email: "getstarted@zurb.com"
            },
            {
              key: "Sir Walter Riley",
              value: "Sir Walter Riley",
              email: "getstarted+riley@zurb.com"
            }
          ]
        };

        let tribute = attachTribute(collectionObject, input.id);

        fillIn(input, " " + trigger);
        let popupList = document.querySelectorAll(
          ".tribute-container > ul > li"
        );
        expect(popupList.length).toBe(2);
        simulateMouseClick(popupList[0]); // click on Jordan Humphreys

        if (elementType === "text") {
          expect(input.value).toBe(" " + trigger + "Jordan Humphreys ");
        } else if (elementType === "contenteditable") {
          expect(input.innerHTML).toBe(
            ' <span contenteditable="false"><a href="http://zurb.com" target="_blank" title="getstarted@zurb.com">Jordan Humphreys</a></span>&nbsp;'
          );
        }

        fillIn(input, " " + trigger + "sir");
        popupList = document.querySelectorAll(".tribute-container > ul > li");
        expect(popupList.length).toBe(1);

        detachTribute(tribute, input.id);
      });

      it(`when values array is large and menuItemLimit is set. For : ${elementType} / ${trigger}`, () => {
        let input = createDomElement(elementType);

        let collectionObject = {
          trigger: trigger,
          menuItemLimit: 25,
          selectTemplate: function(item) {
            if (typeof item === "undefined") return null;
            if (this.range.isContentEditable(this.current.element)) {
              return (
                '<span contenteditable="false"><a href="http://zurb.com" target="_blank" title="' +
                item.original.email +
                '">' +
                item.original.value +
                "</a></span>"
              );
            }

            return trigger + item.original.value;
          },
          values: bigList
        };

        let tribute = attachTribute(collectionObject, input.id);

        fillIn(input, " " + trigger);
        let popupList = document.querySelectorAll(
          ".tribute-container > ul > li"
        );
        expect(popupList.length).toBe(25);

        fillIn(input, " " + trigger + "an");
        popupList = document.querySelectorAll(".tribute-container > ul > li");
        expect(popupList.length).toBe(25);

        detachTribute(tribute, input.id);
      });

      it("should add itemClass to list items when set it config", () => {
        let input = createDomElement(elementType);

        let collectionObject = {
          trigger: trigger,
          itemClass: "mention-list-item",
          selectClass: "mention-selected",
          values: [
            {
              key: "Jordan Humphreys",
              value: "Jordan Humphreys",
              email: "getstarted@zurb.com"
            },
            {
              key: "Sir Walter Riley",
              value: "Sir Walter Riley",
              email: "getstarted+riley@zurb.com"
            }
          ]
        };

        let tribute = attachTribute(collectionObject, input.id);

        fillIn(input, " " + trigger);
        let popupList = document.querySelectorAll(
          ".tribute-container > ul > li"
        );
        expect(popupList.length).toBe(2);

        expect(popupList[0].className).toBe(
          "mention-list-item mention-selected"
        );
        expect(popupList[1].className).toBe("mention-list-item");

        detachTribute(tribute, input.id);
      });
    });
  });
});

describe("Tribute autocomplete mode cases", function() {
  afterEach(function() {
    clearDom();
  });

  ['text', 'contenteditable'].forEach(elementType => {
    it(`when values key with autocompleteSeparator option. For : ${elementType}`, () => {
      let input = createDomElement(elementType);

      let collectionObject = {
        selectTemplate: function (item) {
          return item.original.value;
        },
        autocompleteMode: true,
        autocompleteSeparator: new RegExp(/\-|\+/),
        values: [
          { key: 'Jordan Humphreys', value: 'Jordan Humphreys', email: 'getstarted@zurb.com' },
          { key: 'Sir Walter Riley', value: 'Sir Walter Riley', email: 'getstarted+riley@zurb.com' }
        ],
      }

      let tribute = attachTribute(collectionObject, input.id);

      fillIn(input, '+J');
      let popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(1);
      simulateMouseClick(popupList[0]); // click on Jordan Humphreys

      if (elementType === 'text') {
        expect(input.value).toBe('+Jordan Humphreys ');
      } else if (elementType === 'contenteditable') {
        expect(input.innerText).toBe('+Jordan Humphreys ');
      }

      fillIn(input, ' Si');
      popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(1);

      detachTribute(tribute, input.id);
    });
  });

  ["text", "contenteditable"].forEach(elementType => {
    it(`when values key is predefined array. For : ${elementType}`, () => {
      let input = createDomElement(elementType);

      let collectionObject = {
        selectTemplate: function(item) {
          return item.original.value;
        },
        autocompleteMode: true,
        values: [
          {
            key: "Jordan Humphreys",
            value: "Jordan Humphreys",
            email: "getstarted@zurb.com"
          },
          {
            key: "Sir Walter Riley",
            value: "Sir Walter Riley",
            email: "getstarted+riley@zurb.com"
          }
        ]
      };

      let tribute = attachTribute(collectionObject, input.id);

      fillIn(input, " J");
      let popupList = document.querySelectorAll(".tribute-container > ul > li");
      expect(popupList.length).toBe(1);
      simulateMouseClick(popupList[0]); // click on Jordan Humphreys

      if (elementType === "text") {
        expect(input.value).toBe(" Jordan Humphreys ");
      } else if (elementType === "contenteditable") {
        expect(input.innerText).toBe("Jordan Humphreys ");
      }

      fillIn(input, " Si");
      popupList = document.querySelectorAll(".tribute-container > ul > li");
      expect(popupList.length).toBe(1);

      detachTribute(tribute, input.id);
    });
  });

  ["text", "contenteditable"].forEach(elementType => {
    it(`when values key is a function. For : ${elementType}`, () => {
      let input = createDomElement(elementType);

      let collectionObject = {
        autocompleteMode: true,
        selectClass: "sample-highlight",

        noMatchTemplate: function() {
          this.hideMenu();
        },

        selectTemplate: function(item) {
          if (typeof item === "undefined") return null;
          if (this.range.isContentEditable(this.current.element)) {
            return `&nbsp;<a contenteditable=false>${item.original.value}</a>`;
          }

          return item.original.value;
        },

        values: function(text, cb) {
          searchFn(text, users => cb(users));
        }
      };

      function searchFn(text, cb) {
        if (text === "a") {
          cb([
            { key: "Alabama", value: "Alabama" },
            { key: "Alaska", value: "Alaska" },
            { key: "Arizona", value: "Arizona" },
            { key: "Arkansas", value: "Arkansas" }
          ]);
        } else if (text === "c") {
          cb([
            { key: "California", value: "California" },
            { key: "Colorado", value: "Colorado" }
          ]);
        } else {
          cb([]);
        }
      }

      let tribute = attachTribute(collectionObject, input.id);

      fillIn(input, " a");
      let popupList = document.querySelectorAll(".tribute-container > ul > li");
      expect(popupList.length).toBe(4);
      simulateMouseClick(popupList[0]);

      if (elementType === "text") {
        expect(input.value).toBe(" Alabama ");
      } else if (elementType === "contenteditable") {
        expect(input.innerText).toBe(" Alabama ");
      }

      fillIn(input, " c");
      popupList = document.querySelectorAll(".tribute-container > ul > li");
      expect(popupList.length).toBe(2);
      simulateMouseClick(popupList[1]);

      if (elementType === "text") {
        expect(input.value).toBe(" Alabama  Colorado ");
      } else if (elementType === "contenteditable") {
        expect(input.innerText).toBe(" Alabama   Colorado ");
      }

      fillIn(input, " none");
      let popupListWrapper = document.querySelector(".tribute-container");
      expect(popupListWrapper.style.display).toBe("none");

      detachTribute(tribute, input.id);
    });
  });

  ["contenteditable"].forEach(elementType => {
    it(`should work with newlines`, () => {
      let input = createDomElement(elementType);

      let collectionObject = {
        selectTemplate: function(item) {
          return item.original.value;
        },
        autocompleteMode: true,
        values: [
          {
            key: "Jordan Humphreys",
            value: "Jordan Humphreys",
            email: "getstarted@zurb.com"
          },
          {
            key: "Sir Walter Riley",
            value: "Sir Walter Riley",
            email: "getstarted+riley@zurb.com"
          }
        ]
      };

      let tribute = attachTribute(collectionObject, input.id);
      fillIn(input, "random{newline}J");
      let popupList = document.querySelectorAll(".tribute-container > ul > li");
      expect(popupList.length).toBe(1);
      detachTribute(tribute, input.id);
    });
  });
});

describe("When Tribute searchOpts.skip", function() {
  afterEach(function() {
    clearDom();
  });

  it("should skip local filtering and display all items", () => {
    let input = createDomElement();

    let collectionObject = {
      searchOpts: { skip: true },
      noMatchTemplate: function() {
        this.hideMenu();
      },
      selectTemplate: function(item) {
        return item.original.value;
      },
      values: [
        { key: "Tributação e Divisas", value: "Tributação e Divisas" },
        { key: "Tributação e Impostos", value: "Tributação e Impostos" },
        { key: "Tributação e Taxas", value: "Tributação e Taxas" }
      ]
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, "@random-text");

    let popupList = document.querySelectorAll(".tribute-container > ul > li");
    expect(popupList.length).toBe(3);

    detachTribute(tribute, input.id);
  });
});

describe("Tribute NoMatchTemplate cases", function() {
  afterEach(function() {
    clearDom();
  });

  it("should display template when specified as text", () => {
    let input = createDomElement();

    let collectionObject = {
      noMatchTemplate: "testcase",
      selectTemplate: function(item) {
        return item.original.value;
      },
      values: [
        {
          key: "Jordan Humphreys",
          value: "Jordan Humphreys",
          email: "getstarted@zurb.com"
        },
        {
          key: "Sir Walter Riley",
          value: "Sir Walter Riley",
          email: "getstarted+riley@zurb.com"
        }
      ]
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, "@random-text");

    let containerDiv = document.getElementsByClassName("tribute-container")[0];
    expect(containerDiv.innerText).toBe("testcase");

    detachTribute(tribute, input.id);
  });

  it("should display template when specified as function", () => {
    let input = createDomElement();

    let collectionObject = {
      noMatchTemplate: function() {
        return "testcase";
      },
      selectTemplate: function(item) {
        return item.original.value;
      },
      values: [
        {
          key: "Jordan Humphreys",
          value: "Jordan Humphreys",
          email: "getstarted@zurb.com"
        },
        {
          key: "Sir Walter Riley",
          value: "Sir Walter Riley",
          email: "getstarted+riley@zurb.com"
        }
      ]
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, "@random-text");

    let containerDiv = document.getElementsByClassName("tribute-container")[0];
    expect(containerDiv.innerText).toBe("testcase");

    detachTribute(tribute, input.id);
  });

  it("should display no menu container when text is empty", () => {
    let input = createDomElement();

    let collectionObject = {
      noMatchTemplate: "",
      selectTemplate: function(item) {
        return item.original.value;
      },
      values: [
        {
          key: "Jordan Humphreys",
          value: "Jordan Humphreys",
          email: "getstarted@zurb.com"
        },
        {
          key: "Sir Walter Riley",
          value: "Sir Walter Riley",
          email: "getstarted+riley@zurb.com"
        }
      ]
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, "@random-text");

    let popupListWrapper = document.querySelector(".tribute-container");
    expect(popupListWrapper.style.display).toBe("none");

    detachTribute(tribute, input.id);
  });

  it("should display no menu when function returns empty string", () => {
    let input = createDomElement();

    let collectionObject = {
      noMatchTemplate: function() {
        return "";
      },
      selectTemplate: function(item) {
        return item.original.value;
      },
      values: [
        {
          key: "Jordan Humphreys",
          value: "Jordan Humphreys",
          email: "getstarted@zurb.com"
        },
        {
          key: "Sir Walter Riley",
          value: "Sir Walter Riley",
          email: "getstarted+riley@zurb.com"
        }
      ]
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, "@random-text");

    let popupListWrapper = document.querySelector(".tribute-container");
    expect(popupListWrapper.style.display).toBe("none");

    detachTribute(tribute, input.id);
  });
});

describe("Tribute menu positioning", function() {
  afterEach(function() {
    clearDom();
  });

  function checkPosition(collectionObject, input) {
    let bottomContent = document.createElement("div");
    bottomContent.style = "background: blue; height: 400px; width: 10px;";
    document.body.appendChild(bottomContent);

    let inputRect = input.getBoundingClientRect();
    let inputX = inputRect.x;
    let inputY = inputRect.y;

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, "@");

    let popupListWrapper = document.querySelector(".tribute-container");
    let menuRect = popupListWrapper.getBoundingClientRect();
    let menuX = menuRect.x;
    let menuY = menuRect.y;

    detachTribute(tribute, input.id);
    bottomContent.remove();
    clearDom();
    return { x: menuX, y: menuY };
  }

  it("should display a container menu in the same position when menuContainer is specified on an input as when the menuContainer is the body", () => {
    let input = createDomElement();
    let container = input.parentElement;
    container.style = "position: relative;";
    let { x: specifiedX, y: specifiedY } = checkPosition(
      {
        menuContainer: container,
        values: [
          {
            key: "Jordan Humphreys",
            value: "Jordan Humphreys",
            email: "getstarted@zurb.com"
          },
          {
            key: "Sir Walter Riley",
            value: "Sir Walter Riley",
            email: "getstarted+riley@zurb.com"
          }
        ]
      },
      input
    );

    input = createDomElement();
    let { x: unspecifiedX, y: unspecifiedY } = checkPosition(
      {
        values: [
          {
            key: "Jordan Humphreys",
            value: "Jordan Humphreys",
            email: "getstarted@zurb.com"
          },
          {
            key: "Sir Walter Riley",
            value: "Sir Walter Riley",
            email: "getstarted+riley@zurb.com"
          }
        ]
      },
      input
    );

    expect(unspecifiedY).toEqual(specifiedY);
    expect(unspecifiedX).toEqual(specifiedX);
  });

  it("should display a container menu in the same position when menuContainer is specified on an contenteditable as when the menuContainer is the body", () => {
    let input = createDomElement("contenteditable");
    let container = input.parentElement;
    container.style = "position: relative;";
    let { x: specifiedX, y: specifiedY } = checkPosition(
      {
        menuContainer: container,
        values: [
          {
            key: "Jordan Humphreys",
            value: "Jordan Humphreys",
            email: "getstarted@zurb.com"
          },
          {
            key: "Sir Walter Riley",
            value: "Sir Walter Riley",
            email: "getstarted+riley@zurb.com"
          }
        ]
      },
      input
    );

    input = createDomElement("contenteditable");
    let { x: unspecifiedX, y: unspecifiedY } = checkPosition(
      {
        values: [
          {
            key: "Jordan Humphreys",
            value: "Jordan Humphreys",
            email: "getstarted@zurb.com"
          },
          {
            key: "Sir Walter Riley",
            value: "Sir Walter Riley",
            email: "getstarted+riley@zurb.com"
          }
        ]
      },
      input
    );

    expect(unspecifiedY).toEqual(specifiedY);
    expect(unspecifiedX).toEqual(specifiedX);
  });
});

describe("Multi-char tests", function() {
  afterEach(function() {
    clearDom();
  });

  it("should display no menu when only first char of multi-char trigger is used", () => {
    let input = createDomElement();

    let collectionObject = {
      trigger: "$(",
      selectTemplate: function(item) {
        return item.original.value;
      },
      values: [
        {
          key: "Jordan Humphreys",
          value: "Jordan Humphreys",
          email: "getstarted@zurb.com"
        },
        {
          key: "Sir Walter Riley",
          value: "Sir Walter Riley",
          email: "getstarted+riley@zurb.com"
        }
      ]
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, " $");

    let popupListWrapper = document.querySelector(".tribute-container");
    expect(popupListWrapper).toBe(null);

    detachTribute(tribute, input.id);
  });

  describe("Tribute events", function() {
    afterEach(function() {
      clearDom();
    });

    it("should raise tribute-active-true", () => {
      let input = createDomElement();

      var eventSpy = jasmine.createSpy();
      input.addEventListener("tribute-active-true", eventSpy);

      let collectionObject = {
        noMatchTemplate: function() {
          this.hideMenu();
        },
        selectTemplate: function(item) {
          return item.original.value;
        },
        values: [
          { key: "Tributação e Divisas", value: "Tributação e Divisas" },
          { key: "Tributação e Impostos", value: "Tributação e Impostos" },
          { key: "Tributação e Taxas", value: "Tributação e Taxas" }
        ]
      };

      let tribute = attachTribute(collectionObject, input.id);
      fillIn(input, "@random-text");

      let popupList = document.querySelectorAll(".tribute-container > ul > li");
      expect(eventSpy).toHaveBeenCalled();

      detachTribute(tribute, input.id);
    });
  });

  describe("Tribute events", function() {
    afterEach(function() {
      clearDom();
    });

    it("should raise tribute-active-false", () => {
      let input = createDomElement();

      var eventSpy = jasmine.createSpy();
      input.addEventListener("tribute-active-false", eventSpy);

      let collectionObject = {
        noMatchTemplate: function() {
          return "";
        },
        selectTemplate: function(item) {
          return item.original.value;
        },
        values: [
          { key: "Tributação e Divisas", value: "Tributação e Divisas" },
          { key: "Tributação e Impostos", value: "Tributação e Impostos" },
          { key: "Tributação e Taxas", value: "Tributação e Taxas" }
        ]
      };

      let tribute = attachTribute(collectionObject, input.id);
      fillIn(input, "@random-text");

      let popupList = document.querySelectorAll(".tribute-container > ul > li");
      expect(eventSpy).toHaveBeenCalled();

      detachTribute(tribute, input.id);
    });
  });
});

describe("Tribute loadingItemTemplate", function() {
  afterEach(function() {
    clearDom();
  });

  ["text", "contenteditable"].forEach(elementType => {
    it(`Shows loading item template. For : ${elementType}`, (done) => {
      let input = createDomElement(elementType);

      let collectionObject = {
        loadingItemTemplate: '<div class="loading">Loading</div>',
        values: function(_, cb) {
          setTimeout(() => cb([
            {
              key: "Jordan Humphreys",
              value: "Jordan Humphreys",
              email: "getstarted@zurb.com"
            },
            {
              key: "Sir Walter Riley",
              value: "Sir Walter Riley",
              email: "getstarted+riley@zurb.com"
            }
          ]), 500)
        },
      };

      let tribute = attachTribute(collectionObject, input.id);

      fillIn(input, "@J");
      const loadingItemTemplate = document.querySelectorAll(".loading");
      expect(loadingItemTemplate.length).toBe(1);

      setTimeout(() => {
        const popupList = document.querySelectorAll(".tribute-container > ul > li");
        expect(popupList.length).toBe(1);
        detachTribute(tribute, input.id);
        done();
      }, 1000);
    });
  });
});


describe("Tribute disabled items cases", function() {
  afterEach(function() {
    clearDom();
  });

  it("should prevent selecting disabled items with the mouse", () => {
    let input = createDomElement();

    let collectionObject = {
      selectTemplate: function(item) {
        return item.original.value;
      },
      values: [
        { key: "First item", value: "First item" },
        { key: "Second item (disabled)", value: "Second item (disabled)", disabled:true },
        { key: "Third item", value: "Third item" }
      ]
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, "@");

    let popupList = document.querySelectorAll(".tribute-container > ul > li");
    simulateMouseClick(popupList[1]);
    expect(input.value).toEqual("@");
  });

  it("should prevent selecting disabled items with the keyboard", (done) => {
    let input = createDomElement();

    let collectionObject = {
      selectTemplate: function(item) {
        return item.original.value;
      },
      values: [
        { key: "First item", value: "First item" },
        { key: "Second item (disabled)", value: "Second item (disabled)", disabled:true },
        { key: "Third item", value: "Third item" }
      ]
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, "@");

    //send down arrow
    input.dispatchEvent(new KeyboardEvent("keydown",{
      keyCode:40
    }));
    //send enter
    input.dispatchEvent(new KeyboardEvent("keydown",{
      keyCode:13
    }));

    window.setTimeout(() => {
      //The down arrow key navigation should have skipped the second so we should see
      //the third item in the text
      expect(input.value).toEqual("Third item ");

      //Now lets try again and test up arrow navigation
      fillIn(input,"@");

      //send down arrow so we're on the 3rd item, then we can test the up arrow to go
      //back to the 1st
      input.dispatchEvent(new KeyboardEvent("keydown",{
        keyCode:40
      }));

      //send up arrow
      input.dispatchEvent(new KeyboardEvent("keydown",{
        keyCode:38
      }));

      //send enter
      input.dispatchEvent(new KeyboardEvent("keydown",{
        keyCode:13
      }));

      window.setTimeout(() => {
        //The selection should have been on the first item when
        //we triggered enter, so the first item should be appended
        //to the existing text
        expect(input.value).toEqual("Third item First item ");

        detachTribute(tribute, input.id);
        done();

      },0);

    }, 0);
  });

});


describe('closeOnScroll tests', function() {
  afterEach(function () {
    clearDom();
  });

  it('Tribute should close when the window is scrolled', () => {
    let input = createDomElement();

    let collectionObject = {
      trigger: '@',
      closeOnScroll: true,
      values: [
        { key: 'Jordan Humphreys', value: 'Jordan Humphreys', email: 'getstarted@zurb.com' },
        { key: 'Sir Walter Riley', value: 'Sir Walter Riley', email: 'getstarted+riley@zurb.com' }
      ],
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, '@');

    expect(tribute.isActive).toBe(true);
    simulateElementScroll(window);

    // Need a slight delay otherwise we'll check for the result to fast
    setTimeout(() => {
      expect(tribute.isActive).toBe(false);
    }, 50)

    detachTribute(tribute, input.id);
  });

  it('Tribute should close when the container is scrolled', () => {
    let input = createDomElement();
    let container = document.createElement('div');

    let collectionObject = {
      trigger: '@',
      closeOnScroll: container,
      values: [
        { key: 'Jordan Humphreys', value: 'Jordan Humphreys', email: 'getstarted@zurb.com' },
        { key: 'Sir Walter Riley', value: 'Sir Walter Riley', email: 'getstarted+riley@zurb.com' }
      ],
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, '@');

    expect(tribute.isActive).toBe(true);
    simulateElementScroll(container);

    // Need a slight delay otherwise we'll check for the result to fast
    setTimeout(() => {
      expect(tribute.isActive).toBe(false);
    }, 50)

    detachTribute(tribute, input.id);
  });

  it('Tribute should not close when scrolled without the closeOnScroll set', () => {
    let input = createDomElement();

    let collectionObject = {
      trigger: '@',
      values: [
        { key: 'Jordan Humphreys', value: 'Jordan Humphreys', email: 'getstarted@zurb.com' },
        { key: 'Sir Walter Riley', value: 'Sir Walter Riley', email: 'getstarted+riley@zurb.com' }
      ],
    };

    let tribute = attachTribute(collectionObject, input.id);
    fillIn(input, '@');

    expect(tribute.isActive).toBe(true);
    simulateElementScroll(window);

    // Need a slight delay otherwise we'll check for the result to fast
    setTimeout(() => {
      expect(tribute.isActive).toBe(true);
    }, 50)

    detachTribute(tribute, input.id);
  });
});
