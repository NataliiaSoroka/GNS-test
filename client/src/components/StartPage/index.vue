<template>
  <div class="pa-2">
    <v-layout row justify-space-between class="py-2">
      <v-btn color="blue white--text" @click="openModal">Add item</v-btn>
      <v-flex xs4>
        <v-text-field label="Filter by name" v-model="filter.name"/>
      </v-flex>
      <v-flex xs4>
        <v-text-field label="Filter by location" v-model="filter.location"/>
      </v-flex>
    </v-layout>

    <v-data-table
      :items="filteredTable"
      class="elevation-1"
      :headers="headers"
      :loading="loading"
      item-key="id"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <td class="py-2">{{ props.item.name }}</td>
        <td class="py-2">{{ props.item.location }}</td>
        <td class="py-2">{{ props.item.currency }}</td>
        <td class="text-xs-center">
          <v-btn
            flat icon
            slot="activator"
            @click.stop="openEditModal(props.item)"
          >
            <v-icon color="green">edit</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-center">
          <v-btn
            flat icon
            slot="activator"
            @click.stop="removeItem(props.item._id)"
          >
            <v-icon color="red">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="footer">
        <td colspan="100%">
          <v-layout row>
            <strong>Total currency:</strong>
            <v-spacer />
            <strong>{{totalAmount}}</strong>
          </v-layout>
        </td>
      </template>

    </v-data-table>

    <v-dialog persistent v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{dialogTitle}} item</span>
        </v-card-title>
        <v-card-text>
          <form>
            <v-flex>
              <v-text-field
                solo
                :error-messages="errorMessages($v.item.name)"
                v-model="item.name"
                :error="$v.item.name.$error"
                label="Name"
              />
            </v-flex>
            <v-flex>
              <v-text-field
                solo
                :error-messages="errorMessages($v.item.location)"
                v-model="item.location"
                :error="$v.item.location.$error"
                label="Location"
              />
            </v-flex>
            <v-flex>
              <v-text-field
                solo
                :error-messages="errorMessages($v.item.currency)"
                v-model="item.currency"
                :error="$v.item.currency.$error"
                label="Currency"
              />
            </v-flex>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click.native="close">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="saveItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TableService from '@/services/TableService'
import { clone } from 'ramda'
import { required, numeric } from 'vuelidate/lib/validators'

export default {
  name: 'StartPage',
  data () {
    return {
      table: [],
      filter: {
        name: '',
        location: ''
      },
      filteredTable: [],
      item: {},
      itemState: 'New',
      dialog: false,
      loading: false,
      headers: [
        { text: 'Name', value: 'name', search: true, sortable: true, width: 100 },
        { text: 'Location', value: 'location', search: false, sortable: true, width: 100 },
        { text: 'Currency', value: 'currency', search: false, sortable: true, width: 100 },
        { text: 'Edit', search: false, sortable: false, align: 'center', width: 50 },
        { text: 'Delete', search: false, sortable: false, align: 'center', width: 50 }
      ]
    }
  },
  validations: {
    item: {
      name: {required},
      location: {required},
      currency: {required, numeric}
    }
  },
  watch: {
    'filter.name': {
      handler (val) {
        val.length ? this.filteredTable = [...this.filtrationByField(val, 'name', this.table)] : this.filteredTable = [...this.table]
      },
      immediate: true
    },
    'filter.location': {
      handler (val) {
        val.length ? this.filteredTable = [...this.filtrationByField(val, 'location', this.table)] : this.filteredTable = [...this.table]
      },
      immediate: true
    }
  },
  computed: {
    dialogTitle () {
      return this.itemState
    },
    totalAmount () {
      const total = this.filteredTable.reduce((sum, cur) => sum + cur.currency, 0)
      return total
    },
    errorMessages () {
      return (validObj) => {
        if (validObj && !validObj.required && validObj.$error) {
          return ['The field is required']
        } else if (validObj && !validObj.numeric && validObj.$error) {
          return ['This field should contain only numerics']
        } else {
          return []
        }
      }
    }
  },
  methods: {
    async getTable () {
      this.loading = true
      try {
        const { data } = await TableService.fetchTable()
        this.table = [...data.table]
        this.filteredTable = [...this.table]
        this.loading = false
      } catch (err) {
        console.error(err)
      }
    },
    async removeItem (itemId) {
      try {
        await TableService.deleteItem(itemId)
        this.getTable()
      } catch (err) {
        console.error(err)
      }
    },
    async editItem () {
      try {
        await TableService.updateItem(this.item)
        this.getTable()
      } catch (err) {
        console.error(err)
      }
    },
    async addItem () {
      try {
        await TableService.addNewItem(this.item)
        this.getTable()
      } catch (err) {
        console.error(err)
      }
    },
    openModal () {
      this.item = clone({
        name: '',
        location: '',
        currency: ''
      })
      this.dialog = true
    },
    openEditModal (item) {
      this.item = clone(item)
      this.itemState = 'Edit'
      this.dialog = true
    },
    saveItem () {
      this.$v.item.$touch()
      if (this.$v.item.$invalid) return false
      this.itemState === 'New' ? this.addItem() : this.editItem()
      this.close()
    },
    close () {
      this.itemState = 'New'
      this.dialog = false
      this.$v.item.$reset()
    },
    filtrationByField (val, searchField, array) {
      return array.filter(el => el[searchField].toLowerCase().includes(val.toLowerCase()))
    }
  },
  mounted () {
    this.getTable()
  }
}
</script>

<style>
 .v-dialog--active {
   background-color: white;
 }

 .error--text {
   color: red;
 }
</style>
