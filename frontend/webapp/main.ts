import Button from "sap/m/Button";
import Page from "sap/m/Page";
import App from "sap/m/App";
import List from "sap/m/List";
import ObjectListItem from "sap/m/ObjectListItem";
import Dialog from "sap/m/Dialog";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import DateRangeSelection from "sap/m/DateRangeSelection";
import Toolbar from "sap/m/Toolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import HBox from "sap/m/HBox";
import VBox from "sap/m/VBox";
import ObjectAttribute from "sap/m/ObjectAttribute";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import ObjectStatus from "sap/m/ObjectStatus";

type Book = {
  id: number;
  title: string;
  author: string;
  created_at: string;
  created_by: string;
};

const API_BASE = (window as any).API_BASE || "http://localhost:8001";

const model = new JSONModel({ books: [], query: "", dateFrom: null, dateTo: null });

async function fetchBooks() {
  const state = model.getData() as any;
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.dateFrom) params.set("created_from", new Date(state.dateFrom).toISOString());
  if (state.dateTo) params.set("created_to", new Date(state.dateTo).toISOString());
  const res = await fetch(`${API_BASE}/books?${params.toString()}`);
  const data = await res.json();
  model.setProperty("/books", data);
}

async function createOrUpdateBook(existing?: Book) {
  const dlg = new Dialog({ title: existing ? "Buch bearbeiten" : "Neues Buch" });
  const inpTitle = new Input({ value: existing?.title || "", placeholder: "Titel" });
  const inpAuthor = new Input({ value: existing?.author || "", placeholder: "Autor" });
  const inpBy = new Input({ value: existing?.created_by || "", placeholder: "Erstellt von" });
  const box = new VBox({ items: [new Label({ text: "Titel" }), inpTitle, new Label({ text: "Autor" }), inpAuthor, new Label({ text: "Erstellt von" }), inpBy] });
  dlg.addContent(box);
  dlg.addButton(new Button({ text: "Speichern", type: "Emphasized", press: async () => {
    const payload = { title: inpTitle.getValue(), author: inpAuthor.getValue(), created_by: inpBy.getValue() };
    if (!payload.title || !payload.author || !payload.created_by) { MessageToast.show("Alle Felder sind erforderlich"); return; }
    const url = existing ? `${API_BASE}/books/${existing.id}` : `${API_BASE}/books`;
    const method = existing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    await fetchBooks();
    dlg.close();
  }}));
  dlg.addButton(new Button({ text: "Abbrechen", press: () => dlg.close() }));
  dlg.open();
}

async function deleteBook(book: Book) {
  try {
    const confirmed = await new Promise<boolean>((resolve) => {
      MessageBox.confirm(
        `Möchten Sie das Buch "${book.title}" von ${book.author} wirklich löschen?`,
        {
          title: "Buch löschen",
          onClose: (action) => {
            resolve(action === MessageBox.Action.OK);
          }
        }
      );
    });

    if (confirmed) {
      const response = await fetch(`${API_BASE}/books/${book.id}`, { method: "DELETE" });
      
      if (response.ok) {
        MessageToast.show(`Buch "${book.title}" wurde erfolgreich gelöscht`);
        await fetchBooks();
      } else {
        MessageBox.error("Fehler beim Löschen des Buchs");
      }
    }
  } catch (error) {
    MessageBox.error("Fehler beim Löschen des Buchs");
  }
}

const list = new List({
  items: {
    path: "/books",
    template: new ObjectListItem({
      title: "{title}",
      number: "{author}",
      attributes: [
        new ObjectAttribute({
          title: "Erstellt von",
          text: "{created_by}"
        }),
        new ObjectAttribute({
          title: "Erstellt am",
          text: {
            path: "created_at",
            formatter: (dateString: string) => {
              if (!dateString) return "Unbekannt";
              const date = new Date(dateString);
              return date.toLocaleDateString("de-DE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              });
            }
          }
        })
      ],
      firstStatus: new ObjectStatus({
        text: "Verfügbar",
        state: "Success"
      }),
      press: function(oEvent) {
        const book = oEvent.getSource().getBindingContext().getObject();
        createOrUpdateBook(book);
      },
      actions: [
        new Button({
          text: "Bearbeiten",
          type: "Transparent",
          icon: "sap-icon://edit",
          press: function(oEvent) {
            const book = oEvent.getSource().getParent().getBindingContext().getObject();
            createOrUpdateBook(book);
          }
        }),
        new Button({
          text: "Löschen",
          type: "Transparent",
          icon: "sap-icon://delete",
          press: function(oEvent) {
            const book = oEvent.getSource().getParent().getBindingContext().getObject();
            deleteBook(book);
          }
        })
      ]
    })
  }
});

const dateRange = new DateRangeSelection({
  change: async (e) => {
    const d = e.getSource() as DateRangeSelection;
    const [from, to] = d.getDateValue() && d.getSecondDateValue() ? [d.getDateValue(), d.getSecondDateValue()] : [null, null];
    model.setProperty("/dateFrom", from);
    model.setProperty("/dateTo", to);
    await fetchBooks();
  }
});

const searchInput = new Input({
  placeholder: "Suchen (Titel/Autor)",
  submit: async () => { await fetchBooks(); },
  liveChange: (e) => model.setProperty("/query", (e.getSource() as Input).getValue())
});

const toolbar = new Toolbar({
  content: [
    new Button({ text: "Aktualisieren", press: fetchBooks as any }),
    new ToolbarSpacer(),
    new Label({ text: "Datumsbereich" }),
    dateRange,
    new ToolbarSpacer(),
    searchInput,
    new Button({ text: "Hinzufügen", type: "Emphasized", press: () => createOrUpdateBook() })
  ]
});

const page = new Page({
  title: "Bücher",
  content: [toolbar, list]
});

const app = new App({ pages: [page] });
app.setModel(model);
app.placeAt("content");

fetchBooks();


