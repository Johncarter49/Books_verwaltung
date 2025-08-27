sap.ui.define([
  "sap/m/Button",
  "sap/m/Page",
  "sap/m/App",
  "sap/m/List",
  "sap/m/StandardListItem",
  "sap/m/CustomListItem",
  "sap/m/HBox",
  "sap/m/Text",
  "sap/m/Dialog",
  "sap/m/Input",
  "sap/m/Label",
  "sap/m/DateRangeSelection",
  "sap/m/Toolbar",
  "sap/m/ToolbarSpacer",
  "sap/m/VBox",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function(Button, Page, App, List, StandardListItem, CustomListItem, HBox, Text, Dialog, Input, Label, DateRangeSelection, Toolbar, ToolbarSpacer, VBox, JSONModel, MessageToast, MessageBox) {
  "use strict";

  var API_BASE = (window.API_BASE || "http://localhost:8001");
  var model = new JSONModel({ books: [], query: "", dateFrom: null, dateTo: null });

  function fetchBooks() {
    var state = model.getData();
    var params = new URLSearchParams();
    if (state.query) params.set("q", state.query);
    if (state.dateFrom) params.set("created_from", new Date(state.dateFrom).toISOString());
    if (state.dateTo) params.set("created_to", new Date(state.dateTo).toISOString());
    return fetch(API_BASE + "/books?" + params.toString())
      .then(function(r){ return r.json(); })
      .then(function(data){ model.setProperty("/books", data); });
  }

  function createOrUpdateBook(existing) {
    var dlg = new Dialog({ title: existing ? "Buch bearbeiten" : "Neues Buch" });
    var inpTitle = new Input({ value: existing && existing.title || "", placeholder: "Titel" });
    var inpAuthor = new Input({ value: existing && existing.author || "", placeholder: "Autor" });
    var inpBy = new Input({ value: existing && existing.created_by || "", placeholder: "Erstellt von" });
    var box = new VBox({ items: [new Label({ text: "Titel" }), inpTitle, new Label({ text: "Autor" }), inpAuthor, new Label({ text: "Erstellt von" }), inpBy] });
    dlg.addContent(box);
    dlg.addButton(new Button({ text: "Speichern", type: "Emphasized", press: function() {
      var payload = { title: inpTitle.getValue(), author: inpAuthor.getValue(), created_by: inpBy.getValue() };
      if (!payload.title || !payload.author || !payload.created_by) { MessageToast.show("Alle Felder sind erforderlich"); return; }
      var url = existing ? API_BASE + "/books/" + existing.id : API_BASE + "/books";
      var method = existing ? "PUT" : "POST";
      fetch(url, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function(r){
          if (!r.ok) { return r.text().then(function(t){ throw new Error(t || ("HTTP " + r.status)); }); }
          return r.json ? r.json().catch(function(){ return {}; }) : {};
        })
        .then(function(){ return fetchBooks(); })
        .then(function(){ MessageToast.show(existing ? "Aktualisiert" : "Gespeichert"); dlg.close(); })
        .catch(function(err){ console.error(err); MessageToast.show("Speichern fehlgeschlagen: " + (err && err.message || "Fehler")); });
    }}));
    dlg.addButton(new Button({ text: "Abbrechen", press: function(){ dlg.close(); } }));
    dlg.open();
  }

  function deleteBook(book) {
    return new Promise(function(resolve) {
      MessageBox.confirm(
        'Möchten Sie das Buch "' + book.title + '" von ' + book.author + ' wirklich löschen?',
        {
          title: "Buch löschen",
          onClose: function(action) {
            if (action === MessageBox.Action.OK) {
              fetch(API_BASE + "/books/" + book.id, { method: "DELETE" })
                .then(function(response) {
                  if (response.ok) {
                    MessageToast.show('Buch "' + book.title + '" wurde erfolgreich gelöscht');
                    return fetchBooks();
                  } else {
                    MessageBox.error("Fehler beim Löschen des Buchs");
                  }
                })
                .catch(function(error) {
                  MessageBox.error("Fehler beim Löschen des Buchs");
                });
            }
            resolve();
          }
        }
      );
    });
  }

  var list = new List({
    items: {
      path: "/books",
      template: new CustomListItem({
        content: new VBox({
          width: "100%",
          items: [
            new HBox({
              items: [
                new Text({ text: "{title}" }),
                new Text({ text: " - " }),
                new Text({ text: "{author}" })
              ]
            }),
            new HBox({
              items: [
                new Text({ text: "{created_by}" }),
                new Text({ text: " - " }),
                new Text({ 
                  text: {
                    path: "created_at",
                    formatter: function(date) {
                      if (date) {
                        var d = new Date(date);
                        var day = d.getDate().toString().padStart(2, '0');
                        var month = (d.getMonth() + 1).toString().padStart(2, '0');
                        var year = d.getFullYear();
                        return day + "." + month + "." + year;
                      }
                      return "";
                    }
                  }
                })
              ]
            }),
            new HBox({
              justifyContent: "End",
              items: [
                new Button({ text: "Bearbeiten", type: "Transparent", press: function(e){
                  var ctx = e.getSource().getBindingContext();
                  var book = ctx.getObject();
                  createOrUpdateBook(book);
                }}),
                new Button({ text: "Löschen", type: "Transparent", press: function(e){
                  var ctx = e.getSource().getBindingContext();
                  var book = ctx.getObject();
                  deleteBook(book);
                }})
              ]
            })
          ]
        })
      })
    }
  });

  var dateRange = new DateRangeSelection({
    change: function(e) {
      var d = e.getSource();
      var from = d.getDateValue();
      var to = d.getSecondDateValue();
      model.setProperty("/dateFrom", from);
      model.setProperty("/dateTo", to);
      fetchBooks();
    }
  });

  var searchInput = new Input({
    placeholder: "Suchen (Titel/Autor)",
    submit: function() { fetchBooks(); },
    liveChange: function(e) { model.setProperty("/query", e.getSource().getValue()); }
  });

  var toolbar = new Toolbar({
    content: [
      new Button({ text: "Aktualisieren", press: fetchBooks }),
      new ToolbarSpacer(),
      new Label({ text: "Datumsbereich" }),
      dateRange,
      new ToolbarSpacer(),
      searchInput,
      new Button({ text: "Hinzufügen", type: "Emphasized", press: function() { createOrUpdateBook(); } })
    ]
  });

  var page = new Page({
    title: "Bücher",
    titleSize: "H1",
    content: [toolbar, list]
  });

  var app = new App({ pages: [page] });
  app.setModel(model);
  app.placeAt("content");

  fetchBooks();
});


