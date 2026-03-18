import axios from 'axios';
import authHeader from './auth-header';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/inventory/';

class InventoryService {
  getAllInventory() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getInventoryById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createOrUpdateInventory(inventory) {
    return axios.post(API_URL, inventory, { headers: authHeader() });
  }

  deleteInventory(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  getInventoryByNode(nodeId) {
    return axios.get(API_URL + 'node/' + nodeId, { headers: authHeader() });
  }

  getInventoryByProduct(productId) {
    return axios.get(API_URL + 'product/' + productId, { headers: authHeader() });
  }

  updateInventory(id, inventory) {
    return axios.put(API_URL + id, inventory, { headers: authHeader() });
  }

  getLowStockInventory() {
    return axios.get(API_URL + 'low-stock', { headers: authHeader() });
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
