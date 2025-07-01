<template>
  <h1>Adminstrador</h1>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Instituciones</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Buscar Institución"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-btn @click="openCreateDialog" color="primary"
              >Nueva Institución</v-btn
            >
            <v-data-table
              :headers="headers"
              :items="filteredInstitutions"
              :loading="loading"
              :search="search"
              item-key="_id"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn @click="openEditDialog(item)" icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn @click="deleteInstitution(item._id)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog for Create/Edit Institution -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ formTitle }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="editedItem.name"
              label="Nombre"
              required
            ></v-text-field>
            <v-text-field
              v-model="editedItem.address"
              label="Dirección"
            ></v-text-field>
            <v-text-field
              v-model="editedItem.phone"
              label="Teléfono"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog">Cancelar</v-btn>
          <v-btn @click="saveInstitution" color="primary">{{
            editedIndex === -1 ? "Crear" : "Guardar"
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <snackbar
      :show.sync="snackbar.show"
      :message.sync="snackbar.message"
      :color.sync="snackbar.color"
      :timeout.sync="snackbar.timeout"
    ></snackbar>
  </v-container>
</template>
<script setup></script>
